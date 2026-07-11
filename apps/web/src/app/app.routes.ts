import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
