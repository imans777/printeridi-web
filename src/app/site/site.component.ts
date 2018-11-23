import {Component, OnInit} from '@angular/core';
import {WindowService} from '../shared/services/window.service';
import {ProgressService} from '../shared/services/progress.service';
import {HttpService} from '../shared/services/http.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  /* BEGIN Test */
  answer = '';
  answerAsync = '';
  /* END   test */

  curWidth = 100;
  curHeight = 100;

  constructor(private windowService: WindowService, private progressService: ProgressService,
    private httpService: HttpService) {
  }

  ngOnInit() {
    this.curWidth = this.windowService.getWindow().innerWidth;
    this.curHeight = this.windowService.getWindow().innerHeight;

    this.windowService.getWindow().onresize = (e) => {
      this.curWidth = this.windowService.getWindow().innerWidth;
      this.curHeight = this.windowService.getWindow().innerHeight;
    };
  }

  /* BEGIN test */
  normalClick() {
    this.answer = 'clicked!';
  }

  asyncClick() {
    this.progressService.enable();
    setTimeout(() => {
      this.httpService.post('test', {}).subscribe(
        data => {
          this.progressService.disable();
          this.answerAsync = JSON.stringify(data);
        }, err => {
          this.progressService.disable();
          this.answerAsync = 'COULDN\'T ESTABLISH CONNECTION!';
        }
      );
    }, 1000);
  }

  /* END test */
}
