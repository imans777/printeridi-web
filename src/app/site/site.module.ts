import {NgModule} from '@angular/core';
import {SiteRouting} from './site.routing';
import {CommonModule} from '@angular/common';
import {SiteComponent} from './site.component';
import {
  MatButtonModule,
  MatIconModule,
  MatSidenavModule
} from '@angular/material';

@NgModule({
  imports: [
    SiteRouting,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [
    SiteComponent
  ],
})
export class SiteModule {
}
