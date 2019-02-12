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

  // TODO: setting temperature and cpu usage, etc. here
  // extendedboard connected or not
  //
  constructor(private hs: HttpService) {
  }

  public updateIpList() {
    return new Promise((resolve, reject) => {
      this.hs.post('ip', {}, {throwError: true}).subscribe(data => {
        this.ipList = data['ips'];
        resolve();
      }, err => {
        reject(err);
      });
    });
  }
}
