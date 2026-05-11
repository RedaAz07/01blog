import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface TotalsDto {
  posts: number;
  users: number;
  reports: number;
  banned: number;
}

export interface PostDTO {
  id: number;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  likes: number;
  reports: number;
  status: boolean;
  date: string;
}

export interface UsersDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
  posts: number;
  reports: number;
  joined: string;
}

export interface PageResponse1 {
  content: PostDTO[];
  last: boolean;
}

export interface PageResponse {
  content: UsersDTO[];
  last: boolean;
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
  private usersSubject = new BehaviorSubject<UsersDTO[]>([]);
  public users$ = this.usersSubject.asObservable();

  private postSubject = new BehaviorSubject<PostDTO[]>([]);
  public posts$ = this.postSubject.asObservable();

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

  getAllusers(page: number, size: number = 10, status?: boolean): Observable<PageResponse> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse>(`${this.baseUrl}/users`, { params }).pipe(
      tap((res) => {
        const currentUser = this.usersSubject.value;
        const comninedList = [...currentUser, ...res.content];
        this.usersSubject.next(comninedList);
      }),
    );
  }

  getAllPosts(page: number, size: number = 10, status?: boolean): Observable<PageResponse1> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse1>(`${this.baseUrl}/posts`, { params }).pipe(
      tap((res) => {
        const currentPost = this.postSubject.value;
        const comninedList = [...currentPost, ...res.content];
        this.postSubject.next(comninedList);
      }),
    );
  }

  banUser(username: string): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/admin/banUser/${username}`, {});
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/admin/deleteUser/${username}`, {});
  }

  hidePost(id: number): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/admin/hidePost/${id}`, {});
  }
  deletePost(id : number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/admin/deletePost/${id}`, {});
  }
}
