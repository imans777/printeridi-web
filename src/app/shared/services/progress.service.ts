import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';

export enum ProgressModeEnum {
  determinate = 'determinate',
  indeterminate = 'indeterminate',
  buffer = 'buffer',
  query = 'query',
}

@Injectable()
export class ProgressService {
  progressModeEnum = ProgressModeEnum;
  showProgress: ReplaySubject<boolean> = new ReplaySubject(1);
  progressMode: ReplaySubject<any> = new ReplaySubject(1);
  progressValue: ReplaySubject<number> = new ReplaySubject(1);
  progressBufferValue: ReplaySubject<number> = new ReplaySubject(1);

  constructor() {
    this.showProgress.next(false);

    // Set default values
    this.progressMode.next(this.progressModeEnum.indeterminate);
    this.progressValue.next(50);
    this.progressBufferValue.next(null);
  }

  enable() {
    this.showProgress.next(true);
  }

  disable() {
    this.showProgress.next(false);
  }

}
