import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SiteComponent} from './site.component';

const Site_ROUTES: Routes = [
  {
    path: '', component: SiteComponent, children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', loadChildren: 'app/site/home/home.module#HomeModule'},
  ]
  }
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
