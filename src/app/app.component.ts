import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {SocketService} from './shared/services/socket.service';
import {DataService} from './shared/services/data.service';
import {ThemesEnum} from './shared/enum/themes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isTheme1 = true;

  constructor(private iconRegistry: MatIconRegistry, private vcs: ViewContainerRef, private ds: DataService) {
    // this.iconRegistry.addSvgIcon('custom-mat-icon-label', 'url-of-svg-file-using-dom-sanitizer');
    // usage: <mat-icon svgIcon="custom-mat-icon-label></mat-icon>"
    this.vcs.element.nativeElement.parentElement.classList.add(ThemesEnum.default);
    this.ds.usedTheme$.subscribe(theme => {
      for (const th in ThemesEnum) {
        if (ThemesEnum.hasOwnProperty(th)) {
          this.vcs.element.nativeElement.parentElement.classList.remove(th);
        }
      }
      this.vcs.element.nativeElement.parentElement.classList.add(theme);
    });
  }

  ngOnInit() {

  }

  toggle() {
    this.isTheme1 = !this.isTheme1;
    // WORKS!!!!!!!!!!!!!!!!!!!!!!!!!
    // GENERALIZE THEMEING THING!!!!! -> certain components won't work (e.g. menu)
    // -> do this trick:
    //  set a default theme that uses general things
    //  then anyone wants to add new theme, they're added in a class
    //  and for those certain components, always the default theme applies!
    //  (test overlayContainer to see if it's extensible to these)
    // THINK ABOUT PAGES -> Standalone / tablet / mobile
    // THINK ABOUT Multi-language -> words / directions / fonts / styles ...
  }
}
