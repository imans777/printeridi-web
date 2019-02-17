import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {WindowService} from '../shared/services/window.service';
import {HttpService} from '../shared/services/http.service';
import {TranslatorService} from 'app/shared/services/translator.service';
import {MatSidenav, MatSelect, MatDialog} from '@angular/material';
import {leftNavNormalItems, leftNavOnPrintItems} from 'app/shared/consts/leftnav.const';
import {Router, NavigationEnd} from '@angular/router';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {SpinnerService} from 'app/shared/services/spinner.service';
import {DataService} from 'app/shared/services/data.service';
import {GenericDialogComponent} from 'app/shared/components/generic-dialog/generic-dialog.component';
import {DialogType} from 'app/shared/enum/dialog.enum';
import {ViewerService} from 'app/shared/services/viewer.service';
import {PrintService} from 'app/shared/services/print.service';
import {PageBase} from 'app/shared/classes/page-base.class';
import {NavLink} from 'app/shared/classes/navlink.interface';
import {PrinterTemperatures} from 'app/shared/classes/temperatures.interface';
import {MessageService} from 'app/shared/services/message.service';
import {MsgType} from 'app/shared/enum/msgtype.enum';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent extends PageBase implements OnInit {
  @ViewChild('leftnav') leftNav: MatSidenav;
  @ViewChild('rightnav') rightNav: MatSidenav;
  @ViewChild('sellang') selLang: MatSelect;
  @ViewChild('gcode3dviewer') gcode3DViewer: ElementRef;
  @BlockUI() bu: NgBlockUI;

  // left nav vars
  leftNavItems = leftNavNormalItems;
  selectedLanguage;
  selectedLink = '';

  // these are for gcode viewer
  gcodeViewingLink = null;
  gcodeIndex = 100;

  // right nav vars
  fanStatus = false;
  hardwareInfo = {};
  temps: PrinterTemperatures = {bed: {cur: 0, goal: 0}, ext: {cur: 0, goal: 0}};
  heatTemps = {
    bed: {
      color: 'primary',
      value: 0,
    },
    ext: {
      color: 'primary',
      value: 0,
    }
  };
  colorThreshold = {bed: 50, ext: 180};
  shouldMoveItemExist = true;

  constructor(public ws: WindowService, private hs: HttpService,
    private ds: DataService, public trS: TranslatorService,
    private vs: ViewerService, private ps: PrintService,
    private router: Router, private er: ElementRef,
    private spinnerService: SpinnerService, private ms: MessageService,
    private dialog: MatDialog) {
    super('Main Page');
    this.selectedLink = this.router.url;
    this.routeChecking();
  }

  ngOnInit() {
    // NOTE: Uncomment this code to disable scrollbar in the center part
    // but smooth scrolling when selecting entry, file to view 3d, etc.,
    // will become inactive (only in standalone) as the consequences! :|
    // If found a way to deal with this problem, this code will be used!
    // setTimeout(() => this.hideScrollbar(), 0);

    // TODO: get settings whether to show 3d viewer or not
    // if not, use this code:
    // this.gcode3DViewer.nativeElement.remove();

    setTimeout(() => this.initializeAll());
  }

  initializeAll() {
    this.initializeSpinner();
    this.initializeLanguage();
    this.initializeOnPrintPage();
    this.initializeGcodeLink();
    this.initializeRightNavVars();
    this.initializeHardwareInfo();
  }

  routeChecking() {
    this.router.events.subscribe(route => {
      if (route instanceof NavigationEnd)
        return;

      this.changeLink(route['url']);
      const canHaveGcodeViewer = ['/home', '/print-page'];
      if (canHaveGcodeViewer.some(el => el === route['url'])) {
      } else {
        this.vs.updateGcodeLink(null);
        this.vs.setGcodeIndex(100);
      }
    });
  }

  initializeSpinner() {
    this.spinnerService.spin$.subscribe(spin => {
      if (spin)
        setTimeout(() => this.bu.start());
      else
        setTimeout(() => this.bu.stop());
    });
  }

  initializeLanguage() {
    this.trS.lang$.subscribe(lng => {
      this.selectedLanguage = lng;
    });
  }

  initializeOnPrintPage() {
    this.ps.onPrintPage$.subscribe(isOnPrintPage => {
      if (isOnPrintPage === null)
        return;

      this.shouldMoveItemExist = !isOnPrintPage;

      let dialog: DialogType;
      if (isOnPrintPage) {
        this.leftNavItems = leftNavOnPrintItems;
        dialog = DialogType.shouldGoToPrintPage;
        this.ps.isActivePrint = true;
      } else {
        this.leftNavItems = leftNavNormalItems;
        dialog = DialogType.pageNotAllowed;
      }

      if (!this.leftNavItems.map(el => el['route']).includes(this.router.url)) {
        this.clearSelectedLink();
        if (this.dialog.openDialogs.length)
          return;

        if (this.router.url === '/print-page' && this.ps.isActivePrint)
          return;

        // TODO: don't show inaccessible page as it's so buggish!
        if (dialog === DialogType.pageNotAllowed)
          return;

        this.dialog.open(GenericDialogComponent, {
          data: {
            usage: dialog
          }
        }).afterClosed().subscribe(res => {
          this.router.navigate([this.leftNavItems[0].route]);
          this.changeLink(this.leftNavItems[0].route);
        });
      }
    });
  }

  initializeHardwareInfo() {
    this.ds.hardwareInfo$.subscribe(data => {
      this.hardwareInfo = data;
    });
  }

  initializeGcodeLink() {
    this.vs.fileGcodeLink$.subscribe(link => {
      this.gcodeViewingLink = link;
    });
    this.vs.gcodeIndex$.subscribe(idx => {
      this.gcodeIndex = idx;
    });
  }

  hideScrollbar() {
    const el = this.er.nativeElement.querySelector('#matcontent');
    el.addEventListener('wheel', e => {
      el.scrollTop += e.deltaY;
    });
    el.setAttribute('style', "overflow: hidden;");
  }

  changeLanguage() {
    this.trS.changeLanguageTo(this.selectedLanguage);
  }

  openSelectLang() {
    this.selLang.open();
  }

  clearSelectedLink() {
    this.selectedLink = '';
  }

  toggle(isLeft) {
    if (isLeft) this.leftNav.toggle();
    else this.rightNav.toggle();

    // close least recent sidenav if both are open in mobile view
    if (this.ws.isMobile && this.leftNav.opened && this.rightNav.opened) {
      if (isLeft) this.rightNav.close();
      else this.leftNav.close();
    }

    // if opened right nav, get initial statuses
    if (!isLeft && this.rightNav.opened)
      this.onOpenedRightNav();
  }

  changeLink(link, isLeft = true) {
    if (!link) return;
    this.selectedLink = link;
    if (this.ws.isMobile) {
      if (isLeft) {
        this.leftNav.close();
      }
    }
  }

  onOpenedRightNav() {
    this.ds.getFanStatus();

    this.heatTemps.bed.value = this.temps.bed['goal'];
    this.heatTemps.ext.value = this.temps.ext['goal'];
    this.checkSliderColors();
  }

  // right nav related methods
  initializeRightNavVars() {
    this.ds.temps$.subscribe(res => {
      this.temps = res;
    });

    this.ds.isFanOn$.subscribe(res => {
      if (res === null) return;
      this.fanStatus = res;
    });
  }

  changeFanStatus(status: boolean) {
    this.ds.setFanStatus(status).then(() => this.fanStatus = status);
  }

  sliderDrag(value, type) {
    this.sliderSingleColorChange(value, type);
  }

  checkSliderColors() {
    ['bed', 'ext'].forEach(el => {
      this.sliderSingleColorChange(this.heatTemps[el].value, el);
    });
  }

  sliderSingleColorChange(value, type) {
    if (value >= this.colorThreshold[type])
      this.heatTemps[type].color = 'warn';
    else
      this.heatTemps[type].color = 'primary';
  }

  submitHeat(type) {
    let resultObj;
    if (type === 'bed') {
      resultObj = {
        field: 'bed',
        action: this.heatTemps.bed.value === 0 ? 'cooldown' : 'heat',
        value: this.heatTemps.bed.value
      };
    } else if (type === 'ext') {
      resultObj = {
        field: 'hotend',
        action: this.heatTemps.ext.value === 0 ? 'cooldown' : 'heat',
        value: this.heatTemps.ext.value
      };
    } else {
      return;
    }

    this.hs.post('heat', resultObj).subscribe(res => {
    });
  }

  openMove() {
    // TODO: incomplete
    this.hs.post('home', {axis: 'All'}).subscribe(res => {
      this.ms.open(MsgType.info);
    });
  }

  releaseMotors() {
    this.hs.post('release_motor', {}).subscribe(res => {
      this.ms.open(MsgType.info);
    });
  }

  pageChanged(page: PageBase) {
    this.title = page.title || "Page";
    try {
      this.changeLink(this.leftNavItems.find(el => el.route === this.router.url).route);
    } catch (e) {
      console.error("current route doesn't exist on leftnavitems!");
      this.changeLink(this.router.url);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event, width?, height?) {
    const [w, h] = [event ? event.target.innerWidth : width, event ? event.target.innerHeight : height];
    if (this.ws.curWidth$.getValue() !== w)
      this.ws.curWidth$.next(w);
    if (this.ws.curHeight$.getValue() !== h)
      this.ws.curHeight$.next(h);

    // if (this.ws.checkIsMobile() && this.leftNav.opened && this.rightNav.opened)

    // close on resize to avoid view malfunctioning
    if (this.ws.checkIsMobile())
      return;

    this.leftNav.close();
    this.rightNav.close();
  }
}
