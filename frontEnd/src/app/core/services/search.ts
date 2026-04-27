import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSearchDTO {
  id: number;
  username: string;
}
export interface GlobalSearchDTO {
  users: UserSearchDTO[]; 
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<GlobalSearchDTO> {
    return this.http.get<GlobalSearchDTO>(`http://localhost:8080/api/search?q=${query}`);
  }
}