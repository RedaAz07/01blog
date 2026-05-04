import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfileDTO } from '../core/services/auth';
import { PostService } from '../core/services/post';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  posts: number;
  followers: number;
  following: number;
  notifications: number;
  followingBYMe: boolean;
  bio: string;
  status: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  constructor(
    public authService: AuthService,
    public postService: PostService,
  ) {}
  
  user = signal<UserProfile | null>(null);
  currentUser = signal<UserProfile | null>(null);

  followersList = signal<{ username: string; avatar: string }[]>([]);
  followingList = signal<{ username: string; avatar: string }[]>([]);
  isFollowing = signal(false);

  isCurrentUser = false;

  showEditModal = false;
  showFollowersModal = false;
  showFollowingModal = false;
  showReportModal = false;

  editForm: Partial<UserProfile> = {};

  reportReason = '';
  reportReasons = [
    'Spam or misleading',
    'Harassment or bullying',
    'Hate speech',
    'Impersonation',
    'Inappropriate content',
    'Other',
  ];
  reportSubmitted = false;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((profile) => {
      this.currentUser.set(profile);
      if (!this.user() && profile) {
        this.user.set(profile);
      }

      this.isCurrentUser = this.currentUser()?.username === this.user()?.username;
      this.isFollowing.set(this.user()?.followingBYMe ?? false);

      const targetUsername = this.user()?.username;
      
      // Only fetch the mock data if we actually have a username to look up
      if (targetUsername) {
        this.authService.followers(targetUsername).subscribe((followers) => {
          this.followersList.set(followers);
        });
        this.authService.following(targetUsername).subscribe((following) => {
          this.followingList.set(following);
        });
      }
    });
  }

  getInitials(): string {
    return ((this.user()?.firstName?.[0] ?? '') + (this.user()?.lastName?.[0] ?? '')).toUpperCase();
  }

  openEditModal(): void {
    const currentUserData = this.user();
    if (currentUserData) {
      this.editForm = { ...currentUserData };
    }
    this.showEditModal = true;
  }

  saveEdit(): void {
    this.user.update((current) => {
      if (!current) return null;
      return { ...current, ...this.editForm } as UserProfile;
    });
    this.showEditModal = false;
  }

  toggleFollow(): void {
    this.isFollowing.update(status => !status);
  }

  submitReport(): void {
    if (!this.reportReason) return;
    this.reportSubmitted = true;
    setTimeout(() => {
      this.showReportModal = false;
      this.reportSubmitted = false;
      this.reportReason = '';
    }, 2000);
  }

  closeAllModals(): void {
    this.showEditModal = false;
    this.showFollowersModal = false;
    this.showFollowingModal = false;
    this.showReportModal = false;
  }
}