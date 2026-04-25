
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
// import { AuthService } from '../services/auth.service'; // ← wire your real service

export interface Notification {
  id: number;
  text: string;
  time: string;
  icon: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  read: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(public authService: AuthService) {}



  searchQuery = '';
  notifOpen   = false;
  loadingMore = false;

  notifications: Notification[] = [
    { id: 1, text: 'Alex Rivera liked your post "The Art of Slow Travel"',   time: '2 min ago',  icon: 'favorite',       type: 'like',    read: false },
    { id: 2, text: 'Maya Chen commented on your post.',                       time: '15 min ago', icon: 'chat_bubble',    type: 'comment', read: false },
    { id: 3, text: 'Carlos Vega started following you.',                      time: '1 hr ago',   icon: 'person_add',     type: 'follow',  read: false },
    { id: 4, text: 'Emma Walsh liked your comment.',                          time: '3 hr ago',   icon: 'favorite',       type: 'like',    read: true  },
    { id: 5, text: 'Your post was featured in the weekly digest.',            time: 'Yesterday',  icon: 'campaign',       type: 'system',  read: true  },
    
  ];

  private _allNotifications: Notification[] = [
    ...[] as Notification[], // already shown above
    { id: 6,  text: 'Priya Sharma liked your post.',                         time: '2 days ago', icon: 'favorite',    type: 'like',    read: true },
    { id: 7,  text: 'Tom Nguyen started following you.',                     time: '3 days ago', icon: 'person_add',  type: 'follow',  read: true },
    { id: 8,  text: 'Daniel Park commented on your photo.',                  time: '4 days ago', icon: 'chat_bubble', type: 'comment', read: true },
    { id: 9,  text: 'New feature: Media uploads are now available!',         time: '5 days ago', icon: 'campaign',    type: 'system',  read: true },
    { id: 10, text: 'Sofia Rossi liked your post "Minimalist Photography"',  time: '1 week ago', icon: 'favorite',    type: 'like',    read: true },
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications(): void { this.notifOpen = !this.notifOpen; }
  closeNotifications(): void  { this.notifOpen = false; }

  markRead(n: Notification): void { n.read = true; }

  clearAll(): void { this.notifications = []; }

  loadMore(): void {
    if (this.loadingMore) return;
    this.loadingMore = true;
    setTimeout(() => {
      this.notifications = [...this.notifications, ...this._allNotifications.slice(0, 5)];
      this._allNotifications = this._allNotifications.slice(5);
      this.loadingMore = false;
    }, 800);
  }

  onSearch(): void { /* wire to your search service */ }
  toggleProfileSidebar(): void { /* emit or call sidebar service */ }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.notifOpen = false; }
}