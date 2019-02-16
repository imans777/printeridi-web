import {Component, OnInit, OnDestroy} from '@angular/core';
import {DataService} from 'app/shared/services/data.service';
import {PageBase} from 'app/shared/classes/page-base.class';
import {ViewerService} from 'app/shared/services/viewer.service';
import {MatDialog} from '@angular/material';
import {GenericDialogComponent} from 'app/shared/components/generic-dialog/generic-dialog.component';
import {PrintService} from 'app/shared/services/print.service';
import {Router} from '@angular/router';
import {stringizedTime} from '../../shared/lib/stringedTime';
import {DialogType} from 'app/shared/enum/dialog.enum';
import {ServerMatch} from 'app/shared/servermatch';
import {HttpService} from 'app/shared/services/http.service';
import {PrintStatus} from 'app/shared/enum/print-status.enum';
import {PrintSpeed} from 'app/shared/classes/print-speed.interface';
import {roundTo} from 'app/shared/lib/round-to';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent extends PageBase implements OnInit, OnDestroy {
  playImage;
  pauseImage;
  stopImage;

  percent = 0;
  zPos = 0;
  fileDir = '';
  printTime = '0d 0h 0m';

  printStatusEnum = PrintStatus;
  printStatus: PrintStatus = PrintStatus.printing;

  printSpeed: PrintSpeed = {feedrate: 100, flow: 100};
  minSpeed: PrintSpeed = {feedrate: 0, flow: 0};
  maxSpeed: PrintSpeed = {feedrate: 200, flow: 200};
  limitSpeedChange: PrintSpeed = {feedrate: 0, flow: 0};

  constructor(private ds: DataService, private vs: ViewerService,
    private dialog: MatDialog, private ps: PrintService,
    private router: Router, private hs: HttpService) {
    super('Print');
    this.playImage = ServerMatch.STATIC + 'assets/play.png';
    this.pauseImage = ServerMatch.STATIC + 'assets/pause.png';
    this.stopImage = ServerMatch.STATIC + 'assets/stop.png';
  }

  ngOnInit() {
    this.ps.printStatus$.next(PrintStatus.printing);

    setTimeout(() => {
      this.checkPercentage();
      this.checkFileAndGcodeDirs();
      this.checkPrintTime();
      this.checkPrintStatus();
      this.checkZPos();
      this.checkPrintSpeed();
    });
  }

  checkFileAndGcodeDirs() {
    this.vs.getGcodeLink();
    this.vs.getPrintFileDir();
    this.vs.fileGcodeLink$.subscribe(dat => {
      this.vs.setGcodeIndex(this.percent);
    });
    this.vs.printFileDir$.subscribe(dir => {
      if (!dir) return;
      this.fileDir = dir;
    });
  }

  checkPercentage() {
    this.ps.printPercent$.subscribe(perc => {
      // happens if go to print-page with hand!
      if (this.percent === 0 && perc === 100) {
        return;
      }

      this.percent = perc;
      this.vs.setGcodeIndex(this.percent);

      if (this.percent === 100)
        this.printCompletion();
    });
  }

  checkPrintStatus() {
    this.ps.printStatus$.subscribe(st => {
      this.printStatus = st;

      if (this.printStatus === PrintStatus.idle) {
        // only when the print is stopped by someone else we
        // come here, and we should only go to the home page
        this.router.navigate(['/home']);

        // just temporarily set PrintPage to false, in order to
        // make up for the delay till its next update iteration
        this.ps.onPrintPage$.next(false);
      }
    });
  }

  checkPrintTime() {
    this.ps.printTime$.subscribe(t => {
      if (!t) return;
      this.printTime = stringizedTime(t);
    });
  }

  checkZPos() {
    this.ps.zPosition$.subscribe(z => {
      this.zPos = z;
    });
  }

  checkPrintSpeed() {
    this.ps.printSpeed$.subscribe(speed => {
      this.printSpeed = speed;
      Object.keys(this.printSpeed).forEach(el => this.updateMinMax(el));
    });
  }



  resetPrintSpeed(field) {
    this.changePrintSpeed(field, 100);
  }

  changePrintSpeedSlider(field) {
    if (this.limitSpeedChange[field]) {
      this.printSpeed = this.ps.printSpeed$.getValue();
      return;
    }

    this.setSpeedChangeLimit(field);
    this.changePrintSpeed(field, this.printSpeed[field]);
    this.updateMinMax(field);
  }

  changePrintSpeed(field, value) {
    this.hs.post('speed', {field: (field === 'feedrate' ? 'print' : 'flow'), value}, {spin: false}).subscribe(data => {
      this.printSpeed[field] = value;
      this.ps.getPrintSpeed();
    });
  }

  updateMinMax(field) {
    this.minSpeed[field] = roundTo(Math.abs(this.printSpeed[field] - 50), 2, Math.floor);
    this.maxSpeed[field] = roundTo(this.printSpeed[field] + 50, 2, Math.ceil);
  }

  setSpeedChangeLimit(field) {
    this.limitSpeedChange[field] = 500;
    setTimeout(() => {
      this.limitSpeedChange[field] = 0;
    }, 500);
  }



  changePauseState() {
    const isPaused = this.printStatus === PrintStatus.paused;
    this.hs.post('print', {action: isPaused ? 'resume' : 'pause'}).subscribe(data => {
      // set instantly to true, and then in the next
      // iterate, it will get real true from server!
      // btw, this value is truthy. If the request was successfull, the value
      // would change (so would in the server) and if it fails, it stays the
      // same. This is just to make up for the delay between this request and
      // the next printStatus update in the print service, not a false assumption!
      if (isPaused)
        this.printStatus = PrintStatus.printing;
      else
        this.printStatus = PrintStatus.paused;
    });
  }

  stopPrint() {
    this.dialog.open(GenericDialogComponent, {
      data: {
        usage: DialogType.confirmStopPrint,
      }
    }).afterClosed().subscribe(res => {
      if (!res) return;

      this.hs.post('print', {action: 'stop'}).subscribe(data => {
        this.router.navigate(['/home']);
      });
    });
  }



  printCompletion() {
    if (this.dialog.openDialogs.length)
      return;

    this.dialog.open(GenericDialogComponent, {
      data: {
        usage: DialogType.printCompleted,
        fileDir: this.fileDir,
        time: this.printTime,
      }
    }).afterClosed().subscribe(res => {
      this.router.navigate(['/home']);
    });
  }

  ngOnDestroy() {
    this.ps.isActivePrint = false;
  }
}
