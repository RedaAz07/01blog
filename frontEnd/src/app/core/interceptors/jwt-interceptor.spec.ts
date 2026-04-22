import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; //
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('jwt_token');

        router.navigate(['/login']);
        snackBar.open('Session expired or unauthorized. Please log in again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });
      } else if (error.status !== 200) {
        const backendMessage = error.error?.message || error.error || 'Something went wrong, bro!';

        snackBar.open(`Error: ${backendMessage}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
      return throwError(() => error);
    }),
  );
};
