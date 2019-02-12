import {NgModule} from '@angular/core';
import {SiteRouting} from './site.routing';
import {CommonModule} from '@angular/common';
import {SiteComponent} from './site.component';
import {
  MatButtonModule,
  MatIconModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatRippleModule,
  MatListModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule
} from '@angular/material';
import {ProgressComponent} from '../shared/components/progress/progress.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {GcodeViewerComponent} from '../shared/components/gcode-viewer/gcode-viewer.component';
import {UploadFileComponent} from 'app/shared/components/upload-file/upload-file.component';
import {CovalentFileModule} from '@covalent/core/file';
import {CameraViewerComponent} from 'app/shared/components/camera-viewer/camera-viewer.component';
import {HomeComponent} from './home/home.component';
import {TrlComponent} from 'app/shared/components/trl/trl.component';
import {SettingsComponent} from './settings/settings.component';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {BlockUIModule} from 'ng-block-ui';
import {PrintPageComponent} from './print-page/print-page.component';
import {NgbProgressbarModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GenericDialogComponent} from 'app/shared/components/generic-dialog/generic-dialog.component';
import {RouteReuseStrategy} from '@angular/router';
import {CustomReuseStrategy} from 'app/shared/lib/custom-route-strategy';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    SiteRouting,
    CommonModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatRippleModule,
    MatProgressBarModule,
    MatFormFieldModule,
    CovalentFileModule,
    MatListModule,
    MatSelectModule,
    ScrollToModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    BlockUIModule.forRoot(),
    NgbProgressbarModule.forRoot(),
    // NgbModule.forRoot(),
    MatDialogModule,
    MatSnackBarModule,
  ],
  declarations: [
    SiteComponent,
    ProgressComponent,
    GcodeViewerComponent,
    UploadFileComponent,
    CameraViewerComponent,
    TrlComponent,
    HomeComponent,
    SettingsComponent,
    PrintPageComponent,
    GenericDialogComponent,
  ],
  entryComponents: [
    GenericDialogComponent,
  ],
  providers: [
    // {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
  ]
})
export class SiteModule {
}
