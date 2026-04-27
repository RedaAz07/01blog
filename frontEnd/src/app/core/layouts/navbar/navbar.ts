import { Component, HostListener, OnInit } from '@angular/core'; // 👈 Add OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs'; // 👈 Import RxJS tools
import { AuthService } from '../../services/auth';
import { NotificationDTO, NotificationService } from '../../services/notification';
import { GlobalSearchDTO, SearchService } from '../../services/search';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  searchQuery = '';
  notifOpen   = false;
  currentPage = 0;
  isLastPage  = false;
  isLoading   = false;
  unreadCount$: Observable<number>;

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    private searchService: SearchService 
  ) {
    this.unreadCount$ = this.notificationService.notifications$.pipe(
      map(notifs => notifs.filter(n => !n.isRead).length)
    );
  }
  
  ngOnInit() {
    this.loadMore();
    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap((query) => {
        if (!query.trim()) {
          this.isSearchOpen = false;
          return of(null); 
        }
        this.isSearchOpen = true;
        return this.searchService.search(query).pipe(
          catchError(() => of(null))
        );
      })
    );
  }

 
  toggleNotifications(): void { this.notifOpen = !this.notifOpen; }
  closeNotifications(): void  { this.notifOpen = false; }

  loadMore(): void {
    if (this.isLoading || this.isLastPage) return;
    this.isLoading = true;
    this.notificationService.fetchNotifications(this.currentPage, 5).subscribe({
      next: (response) => {
        this.isLastPage = response.last; 
        this.currentPage++;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications', err);
        this.isLoading = false;
      }
    });
  }

  markRead(n: NotificationDTO): void { 
    if (n.isRead) return; 
    this.notificationService.markAsRead(n.id).subscribe();
    
  }

  clearAll(): void { 
    this.isLastPage = true ;
    this.currentPage = 0;
    this.isLoading = false;
    this.notificationService.clearAll().subscribe();
  }

  toggleProfileSidebar(): void { }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.notifOpen = false; }



  //searchh 

  isSearchOpen = false;

  private searchSubject = new Subject<string>();
  
  searchResults$!: Observable<GlobalSearchDTO | null>;


  onSearch(): void {
    this.searchSubject.next(this.searchQuery)  ;
    
  }
  
  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.searchSubject.next('');
  }


  logout(): void {
    this.authService.logout();
  }
}