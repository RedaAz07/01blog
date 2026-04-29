import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export interface LikeRequestDTO {
  postId: number;
}
export interface LikeResponseDTO {
  likesCount: number;
}
@Injectable({
  providedIn: 'root',
})
export class Like {
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:8080/api/likes';

  likePost(postId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/like`, {});
  }
}
