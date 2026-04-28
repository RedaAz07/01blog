import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export interface PostRequestDTO {
  title: string;
  content: string;
}

// 2. Matches your Spring Boot PostResponseDTO
export interface PostResponseDTO {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  liked: boolean;
  commentsCount: number;
  likesCount: number;
}
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/post/create'; // Change to match your exact endpoint!

  constructor(private http: HttpClient) {}

  // 3. The Create Method
  createPost(data: PostRequestDTO): Observable<PostResponseDTO> {
    return this.http.post<PostResponseDTO>(this.apiUrl, data);
  }

  // 4. (Bonus) The Fetch Method for your Home Feed!
  getFeed(): Observable<PostResponseDTO[]> {
    return this.http.get<PostResponseDTO[]>(this.apiUrl);
  }
}
