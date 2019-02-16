import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';
import {PrintStatus} from '../enum/print-status.enum';
import {PrintSpeed} from '../classes/print-speed.interface';

@Injectable()
export class PrintService {
  onPrintPage$ = new BehaviorSubject<boolean>(false);
  printStatus$ = new BehaviorSubject<PrintStatus>(PrintStatus.printing);
  printPercent$ = new BehaviorSubject<number>(0);
  zPosition$ = new BehaviorSubject<number>(0);
  printSpeed$ = new BehaviorSubject<PrintSpeed>({feedrate: 100, flow: 100});
  printTime$ = new BehaviorSubject<number>(0);

  // a local client-specific to show that we're on the print page or not.
  // this is different from onPrintPage$ and has the following usage.
  // when the print is finished, the onPrintPage$ might immediately be set to false
  // and therefore a dialog opens and says you are in an inaccessible page.
  // however, if a new client joins, he mustn't be redirected to print page and must
  // stay in home (etc.) page. and when showing inaccessible page dialog, we must check
  // this variable that for the active clients, they should not be redirected to home
  // page implicitly without completion dialog, but others should stay in home page!
  // changes:
  // is set to true  if anyhow onPrintPage be true
  // is set to false only after leaving print page
  isActivePrint = false;

  // TODO: check for filament finished

  constructor(private hs: HttpService) {
    this.setIntervals();
  }

  private setIntervals() {
    this.getOnPrintPage();
    setInterval(() => this.getOnPrintPage(), 6000);

    this.getPercentage();
  }

  private getPercentage() {
    let percentAndZInterval;
    let timeInterval;
    this.onPrintPage$.subscribe(isOnPrintPage => {
      if (isOnPrintPage) {
        this.getUsualPrintInfo();
        this.getTime();
        percentAndZInterval = setInterval(() => this.getUsualPrintInfo(), 5000);
        timeInterval = setInterval(() => this.getTime(), 1 * 60 * 1000);
      } else {
        if (percentAndZInterval)
          clearInterval(percentAndZInterval);
        if (timeInterval)
          clearInterval(timeInterval);

        // get the final values
        this.getUsualPrintInfo();
        this.getTime();
      }
    });
  }

  private getUsualPrintInfo() {
    this.getPercentAndZ();
    this.getPauseStatus();
    this.getPrintSpeed();
  }

  getPauseStatus() {
    this.hs.post('interaction', {pkey: 'print_status'}, {spin: false}).subscribe(data => {
      if (data['pvalue'] === undefined || data['pvalue'] === null)
        return;

      // pvalue is number, whilst isPaused is of PrintStatus type
      if (data['pvalue'] === this.printStatus$.getValue())
        return;

      this.printStatus$.next(data['pvalue']);
    });
  }

  private getPercentAndZ() {
    this.hs.post('print', {action: 'percentage'}, {spin: false}).subscribe(data => {
      this.printPercent$.next(data['percentage']);
    });
    this.hs.get('get_z', {spin: false}).subscribe(data => {
      this.zPosition$.next(data['z']);
    });
  }

  private getTime() {
    this.hs.get('get_time', {spin: false}).subscribe(data => {
      this.printTime$.next(data['time']);
    });
  }

  // also call when print speed changes
  public getPrintSpeed() {
    this.hs.get('speed', {spin: false}).subscribe((data: PrintSpeed) => {
      this.printSpeed$.next(data);
    });
  }

  // NOTE: it only updates onPrintPage$ value if the value changes
  // so e.g. three (true, true, true) would only emit 'true' once!
  private getOnPrintPage() {
    let preVal = this.onPrintPage$.getValue();
    this.hs.post('on_print_page', {}, {spin: false}).subscribe(data => {
      const newVal = data && data['page'] === 'print';
      if (newVal === preVal)
        return;

      this.onPrintPage$.next(newVal);
      preVal = newVal;
    });
  }
}
