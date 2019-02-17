import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {PageBase} from 'app/shared/classes/page-base.class';
import {ServerMatch} from 'app/shared/servermatch';
import {HttpService} from 'app/shared/services/http.service';
import {ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import {WindowService} from 'app/shared/services/window.service';
import {MatTableDataSource, MatPaginator, MatDialog} from '@angular/material';
import {DataService} from 'app/shared/services/data.service';
import {SpinnerService} from 'app/shared/services/spinner.service';
import {MessageService} from 'app/shared/services/message.service';
import {MsgType} from 'app/shared/enum/msgtype.enum';
import {DialogType} from 'app/shared/enum/dialog.enum';
import {GenericDialogComponent} from 'app/shared/components/generic-dialog/generic-dialog.component';
import {ViewerService} from 'app/shared/services/viewer.service';
import {Router} from '@angular/router';
import {PrintService} from 'app/shared/services/print.service';
import {DashboardNotification} from 'app/shared/classes/notification.interface';

const GCODE_EXT = '.gcode';
const UPLOAD_PROTOCOL = 'upload://';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends PageBase implements OnInit {
  // should have the same name for scrolling to work
  // mobile uses first name, standalone uses second!
  @ViewChild('fileitems') fileitems: ElementRef;
  @ViewChild('view3d') view3d: ElementRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  usbImage;
  uploadImage;

  cd = '';
  entries = [];
  selectedEntry = '';
  notifs: DashboardNotification[] = [];


  // from the length of this, we can determine if we're in uploaded or usb
  // 'delete' is disabled for usbs
  // 'view' is disabled for folders
  // 'type' is either 'file' (i.e. gcode file) or 'folder'
  displayedColumns = ['type', 'name', 'view', /*, 'delete' -> only for uploads */];
  dataSource = new MatTableDataSource();
  // the couple of (type, name) is unique
  selectedFile = {type: '', name: ''};

  // this is the link for the up button to become visible
  modelFileLink = '';

  //
  tempUnfinishedPrintInfo;

  constructor(private hs: HttpService, private scrollSer: ScrollToService,
    public ws: WindowService, private ds: DataService,
    private spins: SpinnerService, private dialog: MatDialog,
    private ms: MessageService, private vs: ViewerService,
    private router: Router, private ps: PrintService) {
    super('Main Page');
    this.usbImage = ServerMatch.STATIC + 'assets/usb.png';
    this.uploadImage = ServerMatch.STATIC + 'assets/cloud_upload.png';
  }

  ngOnInit() {
    this.getEntries();
    this.initTable();

    this.vs.fileGcodeLink$.subscribe(link => {
      this.modelFileLink = link;
    });

    this.tempUnfinishedPrintInfo = {cd: '', line: 0};
    this.checkNotifications();
  }

  initTable() {
    setTimeout(() => {
      this.dataSource.data = [];
      this.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator = this.paginator;
    }, 0);
  }

  checkNotifications() {
    // - unfinished notif
    this.ds.getAbs().then(() => {
      if (this.ds.abs)
        return Promise.resolve(false);
      return Promise.resolve(true);
    }).then(shouldPrintInstantly => {
      return this.getUnfinishedInfo().then(res => {
        this.tempUnfinishedPrintInfo = res;

        if (shouldPrintInstantly) {
          this.callPrint(this.tempUnfinishedPrintInfo['cd'], this.tempUnfinishedPrintInfo['line']);
          return;
        }

        this.notifs.push({
          title: 'You have an unfinished print!',
          desc: 'Tap here for more info',
          action: this.checkForUnfinishedPrint,
        });
      });
    }).catch(err => console.log(err));

  }

  openNotif(i) {
    this.notifs[i].action.apply(this);
    this.notifs.splice(i, 1);
  }

  checkForUnfinishedPrint() {
    this.showUnfinishedDialog(this.tempUnfinishedPrintInfo['cd']).then(res => {
      if (!res) {
        this.hs.delete('print').subscribe();
        return;
      }

      this.callPrint(this.tempUnfinishedPrintInfo['cd'], this.tempUnfinishedPrintInfo['line']);
    }).catch(err => console.log(err));
  }

  getUnfinishedInfo() {
    return new Promise((resolve, reject) => {
      this.hs.post('print', {action: 'unfinished'}, {spin: false, throwError: true}).subscribe(res => {
        if (!res['unfinished']['exist'])
          reject('no unfinished print');
        resolve({
          cd: res['unfinished']['cd'],
          line: res['unfinished']['line']
        });
      }, err => reject(err));
    });
  }

  showUnfinishedDialog(cd) {
    return new Promise((resolve, reject) => {
      if (this.dialog.openDialogs.length)
        return reject('already open dialog');

      this.dialog.open(GenericDialogComponent, {
        data: {
          usage: DialogType.askForUnfinishedPrint,
          cd
        }
      }).afterClosed().subscribe(res => {
        return resolve(res);
      });
    });
  }

  async viewItem($event, item) {
    this.spins.en();
    $event.stopPropagation();
    await this.vs.updateGcodeLink(this.makeModelDir(item.name));
    setTimeout(() => {
      this.spins.dis();
      this.scrollToPos('view3d');
    }, 500);
  }

  selectItem(item) {
    // change dir for usbs
    if (this.selectedEntry && !this.isUpload())
      this.changeDir(item.name, true);

    this.selectedFile = item;

    // uploaded files don't need to be approved as a valid gcode file
    if (this.isUpload())
      this.approveGCode();
  }

  deleteItem($event, item) {
    $event.stopPropagation();
    if (this.selectedFile.name === item.name)
      this.clearSelectedFile();

    this.dialog.open(GenericDialogComponent, {
      data: {
        usage: DialogType.confirmDelete
      }
    }).afterClosed().subscribe(res => {
      if (!res) return;

      this.hs.delete(`upload-file/${item.name}`).subscribe(data => {
        this.ms.open(MsgType.info);
        this.getUploadedFiles();
      });
    });
  }

  makePrint() {
    let printFileDir = '';
    if (this.isUpload()) {
      printFileDir = UPLOAD_PROTOCOL + this.selectedFile.name;
    } else {
      printFileDir = this.cd + '/' + this.selectedFile.name;
    }

    const dialog = this.dialog.open(GenericDialogComponent, {
      data: {
        usage: DialogType.confirmPrint,
        name: this.selectedFile.name,
      }
    });
    // dialog.afterOpen().subscribe(res => {
    //   this.vs.updatePrintFileDir(printFileDir);
    // });
    dialog.afterClosed().subscribe(res => {
      if (!res) return;

      this.callPrint(printFileDir);
    });
  }

  callPrint(cd, line = 0) {
    this.hs.post('print', {cd, line, action: 'print'}).subscribe(data => {
      // navigate to print page as a new print is started
      this.ps.isActivePrint = true;
      this.router.navigate(['/print-page']);

      // temporarily set this to true
      // to avoid inaccessible page error
      // this.ps.onPrintPage$.next(true);
    });
  }

  changeEntry(ent) {
    this.selectedEntry = ent;
    this.cd = '';
    this.clearSelectedFile();

    if (this.isUpload())
      this.getUploadedFiles();
    else
      this.changeDir(ent);
  }

  // folders use (<folder-name>, true)
  // back use (cd, false)
  // files use (<file-name>, true) -> if file truthy detected, print button will become active
  // for upload, print button will become active and cd will change to 'upload://<file-name>'
  changeDir(dir, isAdd = true) {
    if (!dir || dir === '')
      return;

    // clear selection
    this.clearSelectedFile();

    // if just entry selected, scroll to fileitems
    if (this.cd === '')
      this.scrollToPos('fileitems');

    let newDir = this.cd;
    if (isAdd) {
      newDir += (newDir ? '/' : '') + dir;
    } else {
      const tempDir = dir.split('/');
      newDir = tempDir.splice(0, tempDir.length - 1).join('/');
    }

    this.hs.post('directory', {cd: newDir}, {spin: this.cd === ''}).subscribe(data => {
      if (data && data.type === 'file') {
        this.approveGCode();
      } else {
        this.cd = newDir;
        this.dataSource.data = this.makeData(data.data, false);
      }
    });
  }

  scrollToPos(sc) {
    // each method worked in either mobile or standalone, not both!  :|
    // so functionality needed to be splitted to work cross-platformly!
    if (this.ws.isMobile) {
      // this.fileitemshtml.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      window.scroll({
        top: this[sc].nativeElement.offsetTop,
        behavior: 'smooth'
      });
    } else {
      this.scrollSer.scrollTo({
        target: sc
      });
    }
    // if (window.scrollY)
    // window.scroll(0, window.scrollY - 56);
  }

  // gets the list of usbs (+ upload place)
  getEntries() {
    return this.hs.post('directory', {cd: ''}).subscribe(res => {
      if (res.data.length === 0 || (res.data.length === 1 && res.data[0] === '')) {
        this.entries = [];
      } else {
        this.entries = res.data;
        this.entries.push('Uploads');
      }
    });
  }

  getUploadedFiles() {
    this.hs.get('upload-file').subscribe(res => {
      this.dataSource.data = this.makeData(res.files, true);
      this.scrollToPos('fileitems');
    });
  }

  makeData(data, isUpload = false) {
    const res = [];
    data.forEach(el => {
      res.push({
        'name': el,
        'type': isUpload || el.endsWith(GCODE_EXT) ? 'file' : 'folder'
      });
    });

    this.displayedColumns = ['type', 'name', 'view'];
    if (isUpload) this.displayedColumns.push('delete');

    return res;
  }

  makeModelDir(name) {
    let modelLink = HttpService.Host + '/api/download/';

    if (this.isUpload())
      modelLink += `files/${name}`;
    else
      modelLink += `usbs/${this.cd}/${name}`;

    return modelLink;
  }

  clearSelectedFile() {
    this.selectedFile = {
      type: '',
      name: ''
    };
    this.clearGcodeLink();
  }

  approveGCode() {
    this.selectedFile['gcode-approved'] = true;
  }

  isGCodeApproved() {
    return this.selectedFile['gcode-approved'] || false;
  }

  isUpload() {
    return this.selectedEntry.toLowerCase() === 'uploads';
  }

  isFile(file) {
    return file.endsWith(GCODE_EXT);
  }

  isSelected(row) {
    return this.selectedFile.type === 'file' && this.selectedFile.name === row.name;
  }

  shouldPrintButtonBeActive() {
    return (this.selectedFile && this.selectedFile.type === 'file' && this.isGCodeApproved());
  }

  clearGcodeLink() {
    this.vs.updateGcodeLink(null);
  }
}
