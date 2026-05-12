import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export interface PostRequestDTO {
  title: string;
  content: string;
}

export interface PostUpdateRequestDTO {
  id: number;
  title: string;
  content: string;
}
export interface PostReportRequestDTO {
  reported: string;
  reportedPost?: number;
  reason: string;
}

// 2. Matches your Spring Boot PostResponseDTO
export interface PostResponseDTO {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  status : boolean;
  liked: boolean;
  commentsCount: number;
  likesCount: number;
}
export interface PageResponse {
  content: PostResponseDTO[];
  last: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/post/'; // Change to match your exact endpoint!
  private postSubject = new BehaviorSubject<PostResponseDTO[]>([]);
  public posts$ = this.postSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 3. The Create Method
  createPost(data: PostRequestDTO): Observable<PostResponseDTO> {
    return this.http.post<PostResponseDTO>(`${this.apiUrl}create`, data);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}delete/${postId}`);
  }

  fetchPosts(pageNumber: number, pageSize: number = 10): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    return this.http.get<PageResponse>(`${this.apiUrl}all`, { params }).pipe(
      tap((response) => {
        const currentPosts = this.postSubject.value;
        this.postSubject.next([...currentPosts, ...response.content]);
      }),
    );
  }

  fetchPostsByOwner(pageNumber: number, pageSize: number = 10, username: string): Observable<PageResponse> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    return this.http.get<PageResponse>(`${this.apiUrl}owner/${username}`, { params }).pipe(
      tap((response) => {
        const currentPosts = this.postSubject.value;
        this.postSubject.next([...currentPosts, ...response.content]);
      }),
    );
  }

  updatePost(data: PostUpdateRequestDTO): Observable<PostResponseDTO> {
    return this.http.put<PostResponseDTO>(`${this.apiUrl}update`, data);
  }

  reportPost(data: PostReportRequestDTO): Observable<void> {
    return this.http.post<void>(`http://localhost:8080/api/reports/`, data);
  }
}
