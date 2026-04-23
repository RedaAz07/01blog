import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Login } from './login/login';
import { Home } from './home/home';
import { Register } from './register/register';

import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    component: Home, // (Whatever your home component is called)
    canActivate: [authGuard],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: 'not-found' },
];
