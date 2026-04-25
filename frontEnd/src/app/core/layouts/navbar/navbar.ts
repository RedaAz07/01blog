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
  styleUrls: ['./navbar.css'] // (Changed from styleUrl to styleUrls to match your code)
})
export class Navbar implements OnInit {
  
  searchQuery = '';
  notifOpen   = false;
  
  // 1. Pagination tracking
  currentPage = 0;
  isLastPage  = false;
  isLoading   = false;

  // 2. The dynamic unread badge! (Using an Observable)
  unreadCount$: Observable<number>;

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    private searchService: SearchService // 👈 Inject it!


  ) {
    this.unreadCount$ = this.notificationService.notifications$.pipe(
      map(notifs => notifs.filter(n => !n.isRead).length)
    );
  }

/*   ngOnInit() {
    this.loadMore();
  }
 */
  toggleNotifications(): void { this.notifOpen = !this.notifOpen; }
  closeNotifications(): void  { this.notifOpen = false; }

  loadMore(): void {
    if (this.isLoading || this.isLastPage) return;

    this.isLoading = true;

    this.notificationService.fetchNotifications(this.currentPage, 5).subscribe({
      next: (response) => {
        this.isLastPage = response.last; // Did Spring Boot say this is the end?
        this.currentPage++; // Get ready for the next click
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications', err);
        this.isLoading = false;
      }
    });
  }

  markRead(n: NotificationDTO): void { 
    if (n.isRead) return; // No need to mark again!
    this.notificationService.markAsRead(n.id).subscribe();
    
  }

  clearAll(): void { 
    this.notificationService.clearAll().subscribe();
  }

  toggleProfileSidebar(): void { /* emit or call sidebar service */ }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.notifOpen = false; }



  //searchh 

  isSearchOpen = false;

  // 1. The pipe we shove keystrokes into
  private searchSubject = new Subject<string>();
  
  // 2. The box that holds our live results
  searchResults$!: Observable<GlobalSearchDTO | null>;



  ngOnInit() {
    // 3. Configure the RxJS Magic Pipe!
    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after they stop typing
      distinctUntilChanged(), // Don't search if they typed the same thing twice
      switchMap((query) => {
        if (!query.trim()) {
          this.isSearchOpen = false;
          return of(null); // Return empty if search bar is cleared
        }
        this.isSearchOpen = true;
        return this.searchService.search(query).pipe(
          catchError(() => of(null)) // Prevent app crash if server fails
        );
      })
    );
  }

  // 4. This fires every time you type a letter in the HTML
  onSearch(): void {
    // Shove the current text into the pipe!
    this.searchSubject.next(this.searchQuery);
  }
  
  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.searchSubject.next('');
  }
}