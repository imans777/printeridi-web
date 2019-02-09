import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {WindowService} from '../shared/services/window.service';
import {ProgressService} from '../shared/services/progress.service';
import {HttpService} from '../shared/services/http.service';
import {TranslatorService} from 'app/shared/services/translator.service';
import {MatSidenav, MatSelect, MatDialog} from '@angular/material';
import {leftNavNormalItems, leftNavOnPrintItems} from 'app/shared/consts/leftnav.const';
import {Router} from '@angular/router';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {SpinnerService} from 'app/shared/services/spinner.service';
import {DataService} from 'app/shared/services/data.service';
import {GenericDialogComponent} from 'app/shared/components/generic-dialog/generic-dialog.component';
import {DialogType} from 'app/shared/enum/dialog.enum';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  @ViewChild('leftnav') leftNav: MatSidenav;
  @ViewChild('rightnav') rightNav: MatSidenav;
  @ViewChild('sellang') selLang: MatSelect;
  @BlockUI() bu: NgBlockUI;

  leftNavItems = leftNavNormalItems;
  selectedLanguage;
  selectedLink = {label: '', route: '', icon: ''};

  title = 'Main Page';

  items = Array.from({length: 10}, () => 'item');

  constructor(public ws: WindowService,
    private ps: ProgressService,
    private hs: HttpService,
    private ds: DataService,
    public trS: TranslatorService,
    private router: Router,
    private er: ElementRef,
    private spinnerService: SpinnerService,
    private dialog: MatDialog) {
    this.selectedLink = {
      label: 'default',
      route: this.router.url,
      icon: 'default'
    };
  }

  ngOnInit() {
    // NOTE: Uncomment this code to disable scrollbar in the center part
    // but smooth scrolling when selecting entry, file to view 3d, etc.,
    // will become inactive (only in standalone) as the consequences! :|
    // If found a way to deal with this problem, this code will be used!
    // setTimeout(() => this.hideScrollbar(), 0);

    setTimeout(() => this.initializeAll());
  }

  initializeAll() {
    this.initializeSpinner();
    this.initializeLanguage();
    this.initializeOnPrintPage();
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
    this.ds.onPrintPage$.subscribe(isOnPrintPage => {
      if (isOnPrintPage === null)
        return;

      let dialog: DialogType;
      if (isOnPrintPage) {
        this.leftNavItems = leftNavOnPrintItems;
        dialog = DialogType.shouldGoToPrintPage;
      } else {
        this.leftNavItems = leftNavNormalItems;
        dialog = DialogType.pageNotAllowed;
      }

      if (!this.leftNavItems.map(el => el['route']).some(el => this.router.url === el)) {
        this.clearSelectedLink();
        this.dialog.open(GenericDialogComponent, {
          data: {
            usage: dialog
          }
        }).afterClosed().subscribe(res => {
          this.router.navigate([this.leftNavItems[0].route]);
          this.changeLink(this.leftNavItems[0]);
        });
      }
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
    this.selectedLink = {label: '', route: '', icon: ''};
  }

  toggle(isLeft) {
    if (isLeft) this.leftNav.toggle();
    else this.rightNav.toggle();

    // close least recent sidenav if both are open in mobile view
    if (this.ws.isMobile && this.leftNav.opened && this.rightNav.opened) {
      if (isLeft) this.rightNav.close();
      else this.leftNav.close();
    }
  }

  changeLink(link, isLeft = true) {
    this.selectedLink = link;
    if (this.ws.isMobile) {
      if (isLeft) {
        this.leftNav.close();
      }
    }
  }

  pageChanged(page) {
    this.title = page.title || "Page";
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
    this.leftNav.close();
    this.rightNav.close();
  }
}
