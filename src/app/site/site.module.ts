import {NgModule} from '@angular/core';
import {SiteRouting} from './site.routing';
import {CommonModule} from '@angular/common';
import {SiteComponent} from './site.component';
import {
  MatButtonModule,
  MatIconModule, MatProgressBarModule,
  MatSidenavModule
} from '@angular/material';
import {ProgressComponent} from '../shared/components/progress/progress.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    SiteRouting,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  declarations: [
    SiteComponent,
    ProgressComponent,
  ],
})
export class SiteModule {
}
