import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

function _window() {
  return window;
}

@Injectable()
export class WindowService {
  curWidth$ = new BehaviorSubject<number>(this.getWindow().innerWidth);
  curHeight$ = new BehaviorSubject<number>(this.getWindow().innerHeight);
  isMobile = false;

  constructor() {
    this.curWidth$.subscribe(w => {
      this.isMobile = w < 960;
    });
  }

  checkIsMobile() {
    return this.curWidth$.getValue() < 960;
  }

  getWindow() {
    return _window();
  }
}
