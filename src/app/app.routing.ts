import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';

const APP_ROUTES: Routes = [
  {
    path: '', component: AppComponent,
    // children: []
  },
];

export const AppRouting = RouterModule.forRoot(APP_ROUTES);
