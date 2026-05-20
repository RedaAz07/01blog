import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const snackbar = inject(MatSnackBar);
  
  const token = localStorage.getItem('jwt_token');
  if (token) {
    
    return true; 
  } else {
    snackbar.open('You must be logged in to view this page!', 'Close', { duration: 3000 });
    router.navigate(['/login']);
    return false;
  }
};