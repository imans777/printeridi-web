import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SiteComponent} from './site.component';
import {GcodeViewerComponent} from '../shared/components/gcode-viewer/gcode-viewer.component';

const Site_ROUTES: Routes = [
  {
    path: '', component: SiteComponent, children: [
      // {path: '', redirectTo: 'home', pathMatch: 'full'},
      // {path: 'home', loadChildren: 'app/site/home/home.module#HomeModule'},
      {path: 'gcode', component: GcodeViewerComponent},
    ]
  }
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
