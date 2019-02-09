import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerService {
  // all the "en"ed spinners must be "dis"ed
  // in order to disable spinner block ui
  spin$ = new BehaviorSubject<boolean>(false);
  count = 0;
  timeoutSeconds = 5;

  constructor() {
  }

  // activates spinner
  en() {
    this.count++;

    this.spin$.next(true);

    setTimeout(() => this.checkError(), this.timeoutSeconds * 1000);
  }

  // deactivates spinner
  dis() {
    if (this.count < 1)
      return;

    this.count--;
    if (this.count <= 0)
      this.spin$.next(false);
  }

  // check error after timeout
  checkError() {
    if (this.count <= 0)
      return;

    console.error("spinner is stuck!");
    this.spin$.next(false);
  }
}
