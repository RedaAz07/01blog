import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessageService } from '../services/error-message';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const errorMessageService = inject(ErrorMessageService);

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
      const backendMessage = errorMessageService.getHttpErrorMessage(error);

      if (error.status === 401 && token) {
        localStorage.removeItem('jwt_token');
        router.navigate(['/login']);
      }
      if (error.status === 423 && token) {
        localStorage.removeItem('jwt_token');
        router.navigate(['/login']);
      }
      if (error.status === 403) {
       
        snackBar.open(backendMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
        return throwError(() => error);
      }

      snackBar.open(backendMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });

      return throwError(() => error);
    }),
  );
};
