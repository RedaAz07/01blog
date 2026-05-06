import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, filter, take } from 'rxjs';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const snackbar = inject(MatSnackBar);
  const authService = inject(AuthService);

  if (!localStorage.getItem('jwt_token')) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data['role'];

  return authService.currentUser$.pipe(
    
    filter(user => user !== null), 
    take(1), 
    map(user => {
      if (user!.role === expectedRole || user!.role === 'ROLE_ADMIN') {
        return true; 
      } else {
        snackbar.open('Access Denied: You do not have permission!', 'Close', { duration: 3000 });
        router.navigate(['/home']);
        return false; 
      }
      
    })
  );
};