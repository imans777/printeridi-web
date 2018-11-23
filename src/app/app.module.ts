import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
