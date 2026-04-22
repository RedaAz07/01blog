import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponseDTO {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Look how simple this is now! Just grab the token.
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.loggedInSubject.next(true);
    }
  }

  login(credentials: any): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('jwt_token', response.token); // No more SSR checks!
          this.loggedInSubject.next(true); 
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt_token'); // Trash it
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }
}