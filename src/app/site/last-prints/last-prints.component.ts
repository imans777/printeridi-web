import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from 'app/shared/services/http.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {stringizedTime} from 'app/shared/lib/stringedTime';
import {PrintInfo} from 'app/shared/classes/print-info.interface';

@Component({
  selector: 'app-last-prints',
  templateUrl: './last-prints.component.html',
  styleUrls: ['./last-prints.component.scss']
})
export class LastPrintsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['num', 'file_name', 'filament_type', 'time', 'temperature', 'is_finished'];
  dataSource = new MatTableDataSource();

  constructor(private hs: HttpService) {}

  ngOnInit() {
    this.initTable();
    this.getLastPrints();
  }

  initTable() {
    setTimeout(() => {
      this.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator = this.paginator;
    }, 0);
  }

  getLastPrints() {
    this.hs.get('last_prints').subscribe((res: PrintInfo[]) => {
      if (!res) return;

      res.forEach((el, i) => {
        el['num'] = i + 1;
        el['time'] = stringizedTime(el['time']);
        if (!el.hasOwnProperty('filament_type'))
          el['filament_type'] = 'PLA Test';
        // el['is_finished'] = this.capitalizeFirstLetter(el['is_finished']);
      });
      this.dataSource.data = res;
    });
  }

  capitalizeFirstLetter(string: String) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
