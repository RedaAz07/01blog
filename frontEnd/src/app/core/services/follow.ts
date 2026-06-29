import { Injectable } from '@angular/core';
import { UserProfileDTO } from './auth';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

export interface ToggleFollowResponse {
  isFollowing: boolean;
  followersCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class Follow {
  constructor(private http: HttpClient) {}
  suggestedUsers(): Observable<UserProfileDTO[]> {
    return this.http.get<UserProfileDTO[]>(`http://localhost:8080/api/users/suggestions`);
  }

  toggleFollow(username: string): Observable<ToggleFollowResponse> {
    return this.http.post<ToggleFollowResponse>(`http://localhost:8080/api/users/follow/${username}`, {});
  }
}
