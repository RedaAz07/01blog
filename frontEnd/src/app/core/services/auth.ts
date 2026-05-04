import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponseDTO {
  token: string;
}
export interface registerDTO {
  response: string;
}
export interface registerReqDTO {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  followingBYMe: boolean;
}
export interface UserProfileDTO {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  posts: number;
  followers: number;
  following: number;
  notifications: number;
  followingBYMe: boolean;
  bio: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedInSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<UserProfileDTO | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Look how simple this is now! Just grab the token.
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.loggedInSubject.next(true);
      this.loadCurrentUser().subscribe({});
    }
  }

  login(credentials: any): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('jwt_token', response.token); // No more SSR checks!
        this.loggedInSubject.next(true);
        this.loadCurrentUser().subscribe();
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token'); // Trash it
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  register(userData: registerReqDTO): Observable<registerDTO> {
    return this.http.post<registerDTO>(`${this.apiUrl}/register`, userData);
  }

  loadCurrentUser(): Observable<UserProfileDTO> {
    return this.http.get<UserProfileDTO>(`http://localhost:8080/api/users/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      }),
    );
  }

  profile(username: string): Observable<UserProfileDTO> {
    return this.http.get<UserProfileDTO>(`http://localhost:8080/api/users/profile/${username}`);
  }
  followers(username: string): Observable<{ username: string; avatar: string }[]> {
    return this.http.get<{ username: string; avatar: string }[]>(
      `http://localhost:8080/api/users/followers/${username}`,
    );
  }
  following(username: string): Observable<{ username: string; avatar: string }[]> {
    return this.http.get<{ username: string; avatar: string }[]>(
      `http://localhost:8080/api/users/following/${username}`,
    );
  }
}
