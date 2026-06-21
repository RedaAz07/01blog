import { Component, inject, OnInit, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs'; 
import { AuthService, UserProfileDTO } from '../../services/auth';
import { NotificationDTO, NotificationService } from '../../services/notification';
import { GlobalSearchDTO, SearchService } from '../../services/search';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit {
  searchQuery = '';
  notifOpen = false;
  currentPage = 0;
  isLastPage = false;
  isLoading = false;
  currentUser = signal<UserProfileDTO | null>(null);


  authService =  inject(AuthService);
  notificationService = inject(NotificationService);
  searchService = inject(SearchService);
  themeService = inject(ThemeService);  
  
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });

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
        return this.searchService.search(query).pipe(catchError(() => of(null)));
      }),
    );
  }

  toggleNotifications(): void {
    this.notifOpen = !this.notifOpen;
  }
  closeNotifications(): void {
    this.notifOpen = false;
  }
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

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
        this.isLoading = false;
      },
    });
  }

  markRead(n: NotificationDTO): void {
    if (n.isRead) return;
    this.notificationService.markAsRead(n.id).subscribe();
    this.currentUser.update((u) => {
      if (!u) return u;
      return {
        ...u,
        notifications: u.notifications - 1,
      };
    });
    
  }

  clearAll(): void {
    this.isLastPage = true;
    this.currentPage = 0;
    this.isLoading = false;
    this.notificationService.clearAll().subscribe(
      {
      next: () => {
      this.currentUser.update((u) => {
        if (!u) return u;
        return {
          ...u,
          notifications: 0,
        };
      });

    },
    
  });
  }

  toggleProfileSidebar(): void {}

  

  //searchh

  isSearchOpen = false;

  private searchSubject = new Subject<string>();

  searchResults$!: Observable<GlobalSearchDTO | null>;

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
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
