import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TotalsDto {
  posts: number;
  users: number;
  reports: number;
  banned: number;
}

export interface TopReportedDto {
  count: number;
  username: string;
  firstName: string;
  lastName: string;
  status: boolean;
}

export interface WeeklyPosts {
  day: String;
  count: number;
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

  getWeeklyPosts(): Observable<WeeklyPosts[]> {
    return this.http.get<WeeklyPosts[]>(`${this.baseUrl}/weeklyPosts`);
  }

  getTopReported(): Observable<TopReportedDto[]> {
    return this.http.get<TopReportedDto[]>(`${this.baseUrl}/TopReporeted`);
  }
}
