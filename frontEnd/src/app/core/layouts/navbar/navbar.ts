import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AuthService, UserProfileDTO } from '../../services/auth';
import { NotificationDTO, NotificationService } from '../../services/notification';
import { GlobalSearchDTO, SearchService } from '../../services/search';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit, OnDestroy {
  searchQuery = '';
  notifOpen = false;
  currentPage = 0;
  isLastPage = false;
  isLoading = false;
  currentUser = signal<UserProfileDTO | null>(null);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  searchService = inject(SearchService);

  isSearchOpen = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  searchResults$!: Observable<GlobalSearchDTO | null>;

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
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
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  toggleNotifications(): void {
    this.notifOpen = !this.notifOpen;
    // Close search when opening notifications to avoid overlapping popups
    if (this.notifOpen) {
      this.closeSearch();
    }
  }

  closeNotifications(): void {
    this.notifOpen = false;
  }

  loadMore(): void {
    if (this.isLoading || this.isLastPage) return;
    this.isLoading = true;
    this.notificationService
      .fetchNotifications(this.currentPage, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLastPage = response.last;
          this.currentPage++;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  markRead(n: NotificationDTO): void {
    if (n.isRead) return;

    // Optimistic update
    this.currentUser.update((u) => {
      if (!u) return u;
      return {
        ...u,
        notifications: Math.max(0, u.notifications - 1),
      };
    });

    this.notificationService.markAsRead(n.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          // Rollback on failure
          this.currentUser.update((u) => {
            if (!u) return u;
            return {
              ...u,
              notifications: u.notifications + 1,
            };
          });
        },
      });
  }

  clearAll(): void {
    this.notificationService.clearAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentUser.update((u) => {
            if (!u) return u;
            return {
              ...u,
              notifications: 0,
            };
          });
          // Reset pagination state since the list is now empty
          this.isLastPage = false;
          this.currentPage = 0;
        },
        error: () => {
          // Clear failed silently — user can retry
        },
      });
  }

  toggleProfileSidebar(): void {}

  // ---- Search ----

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

  // ---- trackBy helpers for *ngFor performance ----

  trackByUserId(_index: number, user: { id: number }): number {
    return user.id;
  }

  trackByNotificationId(_index: number, n: NotificationDTO): number {
    return n.id;
  }
}
