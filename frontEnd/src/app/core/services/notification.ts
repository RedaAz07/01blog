import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface NotificationDTO {
  id: number;
  message: string;
  senderUsername: string;
  isRead: boolean;
  timestamp: string;
}

export interface PageResponse {
  content: NotificationDTO[];
  last: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  
  private notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchNotifications(pageNumber: number, pageSize: number = 5): Observable<PageResponse> {
    
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    return this.http.get<PageResponse>('http://localhost:8080/api/notifications/', { params }).pipe(
      tap((response) => {
        const currentNotifications = this.notificationsSubject.value;
        
        const combinedList = [...currentNotifications, ...response.content];
        
        this.notificationsSubject.next(combinedList);
      })
    );
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`http://localhost:8080/api/notifications/read/${notificationId}`, {}).pipe(
      tap(() => {
        const updatedNotifications = this.notificationsSubject.value.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        this.notificationsSubject.next(updatedNotifications);
      })
    );
  }
  clearAll(): Observable<void> {
    return this.http.delete<void>('http://localhost:8080/api/notifications/clear').pipe(
      tap(() => {
        this.notificationsSubject.next([]);
      })
    );
  }
}