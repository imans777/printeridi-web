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
  fileDir = '';
  printTime = '0d 0h 0m';
  printStatusEnum = PrintStatus;
  printStatus: PrintStatus = PrintStatus.idle;

  constructor(private ds: DataService, private vs: ViewerService,
    private dialog: MatDialog, private ps: PrintService,
    private router: Router, private hs: HttpService) {
    super('Print');
    this.playImage = ServerMatch.STATIC + 'assets/play.png';
    this.pauseImage = ServerMatch.STATIC + 'assets/pause.png';
    this.stopImage = ServerMatch.STATIC + 'assets/stop.png';
  }

  ngOnInit() {
    this.vs.getGcodeLink();
    this.vs.getPrintFileDir();
    this.vs.fileGcodeLink$.subscribe(dat => {
      this.vs.setGcodeIndex(this.percent);
    });

    this.ps.printPercent$.subscribe(perc => {
      if (perc < this.percent) {
        // print finished and percent changed to 0
        this.printCompletion();
        return;
      }

      this.percent = perc;
      this.vs.setGcodeIndex(this.percent);

      if (this.percent === 100)
        this.printCompletion();
    });

    this.ps.printTime$.subscribe(t => {
      if (!t) return;
      this.printTime = stringizedTime(t);
    });

    this.vs.printFileDir$.subscribe(dir => {
      if (!dir) return;
      this.fileDir = dir;
    });

    this.ps.printStatus$.subscribe(st => {
      this.printStatus = st;

      if (this.printStatus === PrintStatus.idle) {
        this.ps.isActivePrint = false;
      }
    });
  }

  changePauseState() {
    const isPaused = this.printStatus === PrintStatus.paused;
    this.hs.post('print', {action: isPaused ? 'resume' : 'pause'}).subscribe(data => {
      // set instantly to true, and then in the next
      // iterate, it will get real true from server!
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
