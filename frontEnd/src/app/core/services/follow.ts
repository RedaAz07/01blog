import { Injectable } from '@angular/core';
import { UserProfileDTO } from './auth';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Follow {
  constructor(private http: HttpClient) {}
  suggestedUsers(): Observable<UserProfileDTO[]> {
    return this.http.get<UserProfileDTO[]>(`http://localhost:8080/api/users/suggestions`);
  }

  toggleFollow(username: string): Observable<any> {
    return this.http.post(`http://localhost:8080/api/users/follow/${username}`, {});
  }
}
