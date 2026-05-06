import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Login } from './login/login';
import { Home } from './home/home';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import { MainLayout } from './core/layouts/main-layout/main-layout';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { roleGuard } from './core/guards/role-guard';
import { AdminDashboardComponent } from './admin-dashboard-component/admin-dashboard-component';
export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'profile/:username', component: Profile },
      { path: 'dashboard', canActivate: [roleGuard], component: AdminDashboardComponent },
    ],
  },

  /*  {
      path: 'admin',
      canActivate: [authGuard, roleGuard],
      data: { role: 'ADMIN' },

      children: [
        { path: 'ban-user', component: BanUserComponent },
        { path: 'hide-post', component: HidePostComponent },
        { path: 'delete-user', component: DeleteUserComponent },
        { path: 'delete-post', component: DeletePostComponent },

        // Optional: A default dashboard if they just type /admin
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: AdminDashboardComponent },
      ], 
    } */
  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: 'not-found' },
];
