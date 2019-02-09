import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {MatButtonModule, MatIconModule, MatProgressBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SiteModule} from './site/site.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WindowService} from './shared/services/window.service';
import {HttpService} from './shared/services/http.service';
import {SocketService} from './shared/services/socket.service';
import {HttpClientModule} from '@angular/common/http';
import {ProgressService} from './shared/services/progress.service';
import {AppRouting} from './app.routing';
import {DataService} from './shared/services/data.service';
import {TranslatorService} from './shared/services/translator.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SpinnerService} from './shared/services/spinner.service';
import {MessageService} from './shared/services/message.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SiteModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRouting,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  providers: [
    WindowService,
    HttpService,
    SocketService,
    ProgressService,
    DataService,
    TranslatorService,
    SpinnerService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('theme1');
    overlayContainer.getContainerElement().classList.add('theme2');
  }
}
