import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export interface LikeRequestDTO {
  postId: number;
}
export interface LikeResponseDTO {
  nbLikes: number;
  isLiked: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class Like {
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:8080/api/likes';

  likePost(postId: number): Observable<LikeResponseDTO> {
    return this.http.post<LikeResponseDTO>(`${this.apiUrl}/${postId}/like`, {});
  }
}
