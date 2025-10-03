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
    title: 'Login'
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
    title: 'Register'
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
          import('./components/job/lis-jobs/lis-jobs.component').then((m) => m.LisJobsComponent),
        title: 'Dashboard-Jobs'
      }, {
        path: 'depts',
        loadComponent: () =>
          import('./components/department/list-departments/list-departments.component').then((m) => m.ListDepartmentsComponent),
        title: 'Dashboard-Depts'
      },
       {
        path: 'addresses',
        loadComponent: () =>
          import('./components/adress/list-addresses/list-addresses.component').then((m) => m.ListAddressesComponent),
        title: 'Dashboard-Addresses'
      },
    ],

  },
  {
    path: '**', loadComponent: () =>
      import('./shared/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Page Not Found'
  },
];

