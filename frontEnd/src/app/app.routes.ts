import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { NotFoundComponent } from './not-found-component/not-found-component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: '**', redirectTo: 'not-found'}
];
