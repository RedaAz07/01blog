import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GlobalSearchDTO {
  users: any[]; // Replace 'any' with your actual User DTO
  posts: any[]; // Replace 'any' with your actual Post DTO
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<GlobalSearchDTO> {
    return this.http.get<GlobalSearchDTO>(`http://localhost:8080/api/search?q=${query}`);
  }
}