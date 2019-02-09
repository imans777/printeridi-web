import {Component, OnInit} from '@angular/core';
import {DataService} from 'app/shared/services/data.service';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {
  percent = 0;
  modelDir = '';

  constructor(private ds: DataService) {}

  ngOnInit() {
    this.modelDir = this.ds.printingFileDownloadableDir;
    this.ds.printPercent$.subscribe(perc => {
      this.percent = perc;
    });
  }

}
