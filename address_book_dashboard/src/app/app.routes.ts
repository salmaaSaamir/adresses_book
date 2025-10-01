import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/adress/list-addresses/list-addresses.component').then((m) => m.ListAddressesComponent),
      }, {
        path: 'jobs',
        loadComponent: () =>
          import('./components/job/lis-jobs/lis-jobs.component').then((m) => m.LisJobsComponent),
      }, {
        path: 'depts',
        loadComponent: () =>
          import('./components/department/list-departments/list-departments.component').then((m) => m.ListDepartmentsComponent),
      }
    ],

  },
  {
    path: '**', loadComponent: () =>
      import('./auth/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

