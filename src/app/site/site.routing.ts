import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SiteComponent} from './site.component';
import {HomeComponent} from './home/home.component';
import {CameraViewerComponent} from 'app/shared/components/camera-viewer/camera-viewer.component';
import {SettingsComponent} from './settings/settings.component';
import {PrintPageComponent} from './print-page/print-page.component';

const Site_ROUTES: Routes = [
  {
    path: '', component: SiteComponent, children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},

      // these two paths' components' states are saved via customReuseStrategy!
      // so changing the path of these two should affect the routes there too!
      {path: 'home', component: HomeComponent},
      {path: 'print-page', component: PrintPageComponent},

      {path: 'camera', component: CameraViewerComponent},
      // {path: 'extrude', component: ''},
      // {path: 'bedleveling', component: ''},
      // {path: 'last-prints', component: ''},
      {path: 'settings', component: SettingsComponent},
      // {path: 'home', loadChildren: 'app/site/home/home.module#HomeModule'},
    ]
  }
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
