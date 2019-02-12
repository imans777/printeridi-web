import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpService} from './http.service';

@Injectable()
export class ViewerService {

  printFileDir$ = new BehaviorSubject<string>(null);
  fileGcodeLink$ = new BehaviorSubject<string>(null);
  gcodeIndex$ = new BehaviorSubject<number>(100);

  constructor(private hs: HttpService) {
  }

  updateGcodeLink(link) {
    if (!link) {
      this.fileGcodeLink$.next(null);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const oldLink = this.fileGcodeLink$.getValue();
      if (!link)
        link = oldLink;
      this.hs.put('interaction', {pkey: 'gcode_downloadable_link', pvalue: link}, {spin: false, throwError: true}).subscribe(data => {
        if (link === oldLink)
          return;

        this.fileGcodeLink$.next(link);
        resolve();
      }, err => {
        reject();
      });
    });
  }

  getGcodeLink() {
    this.hs.post('interaction', {pkey: 'gcode_downloadable_link'}).subscribe(data => {
      this.fileGcodeLink$.next(data['pvalue']);
    });
  }

  updatePrintFileDir(dir) {
    return new Promise((resolve, reject) => {
      this.hs.put('interaction', {pkey: 'print_file_dir', pvalue: dir}, {spin: false, throwError: true}).subscribe(data => {
        this.printFileDir$.next(dir);
        resolve();
      }, err => {
        reject();
      });
    });
  }

  getPrintFileDir() {
    this.hs.post('interaction', {pkey: 'print_file_dir'}).subscribe(data => {
      this.printFileDir$.next(data['pvalue']);
    });
  }

  setGcodeIndex(idx = 100) {
    if (idx < 0 || idx > 100)
      return;

    this.gcodeIndex$.next(idx);
  }

}
