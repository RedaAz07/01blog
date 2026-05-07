import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TotalsDto {
  posts: number;
  users: number;
  reports: number;
  banned: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminDashboard {
  baseUrl = 'http://localhost:8080/api/admin/stats';

  constructor(private http: HttpClient) {}

  getTotals(): Observable<TotalsDto> {
    return this.http.get<TotalsDto>(`${this.baseUrl}/totals`);
  }
}
