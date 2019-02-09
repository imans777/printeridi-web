import {Injectable, OnInit} from '@angular/core';
import {HttpService} from './http.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ThemesEnum} from '../enum/themes.enum';

@Injectable()
export class DataService {
  // IMPORTANT NOTE: REMEMBER!
  // NEVER EVER implement from onInit in a SERVICE! IT BREAKS!
  ipList = [];
  usedTheme$ = new BehaviorSubject<ThemesEnum>(ThemesEnum.default);
  onPrintPage$ = new BehaviorSubject<boolean>(null);
  printingFileDir;
  printingFileDownloadableDir;
  printPercent$ = new BehaviorSubject<number>(0);

  constructor(private hs: HttpService) {
    this.setIntervals();
  }

  setIntervals() {
    this.getOnPrintPage();
    setInterval(() => this.getOnPrintPage(), 6000);

    this.getPercentage();
  }

  getPercentage() {
    let percentInterval;
    this.onPrintPage$.subscribe(isOnPrintPage => {
      if (isOnPrintPage) {
        percentInterval = setInterval(() => {
          this.hs.post('print', {action: 'percentage'}, {spin: false}).subscribe(data => {
            this.printPercent$.next(data['percentage']);
          });
        }, 5000);
      } else {
        if (percentInterval) {
          clearInterval(percentInterval);
          percentInterval = null;
        }
      }
    });
  }

  getOnPrintPage() {
    let preVal = this.onPrintPage$.getValue();
    this.hs.post('on_print_page', {}, {spin: false}).subscribe(data => {
      const newVal = data && data['page'] === 'print';
      if (newVal !== preVal) {
        this.onPrintPage$.next(newVal);
        preVal = newVal;
      }
    });
  }

  updateIpList() {
    return new Promise((resolve, reject) => {
      this.hs.post('ip', {}, {throwError: true}).subscribe(data => {
        console.log('post ips data are: ', data);
        this.ipList = data['ips'];
        resolve();
      }, err => {
        reject(err);
      });
    });
  }
}
