import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { NotificationDTO } from './notification';

export interface CommentRequestDTO {
  postId: number;
  content: string;
}

export interface CommentResponseDTO {
  id: number;
  content: string;
  authorUsername: string;
  timestamp: string;
}

export interface PageResponse {
  content: CommentResponseDTO[];
  last: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Comment {
  private commentSubject = new BehaviorSubject<CommentResponseDTO[]>([]);
  public comments$ = this.commentSubject.asObservable();

  constructor(private http: HttpClient) {}

  createComment(data: CommentRequestDTO): Observable<CommentResponseDTO> {
    return this.http.post<CommentResponseDTO>('http://localhost:8080/api/comment/create', data);
  }

  fetchComments(page: number, size: number = 5, postId: number): Observable<PageResponse> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<PageResponse>(`http://localhost:8080/api/comment/${postId}/list`, {
      params,
    });
  }
  deleteComment(commentId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `http://localhost:8080/api/comment/${commentId}/delete`,
    );
  }
}
