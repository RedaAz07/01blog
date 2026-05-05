import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfileDTO } from '../core/services/auth';
import { PostService } from '../core/services/post';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Follow } from '../core/services/follow';

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
    private route: ActivatedRoute,
    private router: Router,
    public followService: Follow,
    public postsService: PostService,
  ) {}
  snackbar = inject(MatSnackBar);

  user = signal<UserProfile | null>(null);
  currentUser = signal<UserProfile | null>(null);
  isCurrentUser = computed(() => {
    const pUser = this.user();
    const cUser = this.currentUser();
    // Return true ONLY if both exist and the usernames match
    return pUser != null && cUser != null && pUser.username === cUser.username;
  });
  followersList = signal<{ username: string; avatar: string }[]>([]);
  followingList = signal<{ username: string; avatar: string }[]>([]);
  isFollowing = signal(false);
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
    this.route.params.subscribe((params) => {
      const username = params['username'];
      this.loadUserProfile(username);
    });

    this.authService.currentUser$.subscribe((profile) => {
      this.currentUser.set(profile);
    });
  }

  loadUserProfile(username: string): void {
    this.authService.profile(username).subscribe({
      next: (profile: any) => {
        this.user.set(profile);
        this.isFollowing.set(profile.FollowingBYMe);
        console.log(profile.FollowingBYMe);
      },
      error: (err) => {
        this.router.navigate(['/home']);
        this.user.set(null);
      },
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
    this.authService.editProfile(this.user()?.username ?? '', this.editForm).subscribe({
      next: (updatedProfile) => {
        this.user.set(updatedProfile);
        this.showEditModal = false;
        this.snackbar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        let errMsg = err.error?.message || 'Failed to update profile';
        this.snackbar.open('Error: ' + errMsg, 'Close', { duration: 5000 });
      },
    });
  }

  toggleFollow(): void {
    this.followService.toggleFollow(this.user()?.username ?? '').subscribe({
      next: (res) => {
        console.log(res);

        this.isFollowing.set(res);
        const userData = this.user();
        if (userData) {
          userData.followers += res ? 1 : -1;
          this.user.set({ ...userData });
          this.snackbar.open(res ? 'Unfollowed successfully!' : 'Followed successfully!', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (err) => {
        let errMsg = err.error?.message || 'Failed to update follow status';
        this.snackbar.open('Error: ' + errMsg, 'Close', { duration: 5000 });
      },
    });
  }

  submitReport(): void {
    this.postService
      .reportPost({
        reported: this.user()?.username ?? '',
        reason: this.reportReason,
      })
      .subscribe({
        next: () => {
          this.reportSubmitted = true;
          this.snackbar.open('User reported successfully!', 'Close', { duration: 3000 });
        },
        error: (err) => {
          let errMsg = err.error?.message || 'Failed to report user';
          this.snackbar.open('Error: ' + errMsg, 'Close', { duration: 5000 });
        },
      });
  }

  closeAllModals(): void {
    this.showEditModal = false;
    this.showFollowersModal = false;
    this.showFollowingModal = false;
    this.showReportModal = false;
  }

  freindsList(type: 'followers' | 'following'): void {
    if (type === 'followers') {
      this.showFollowersModal = true;
      this.authService.followers(this.user()?.username ?? '').subscribe((list) => {
        this.followersList.set(list);
        this.showFollowersModal = true;
      });
    } else {
      this.showFollowingModal = true;
      this.authService.following(this.user()?.username ?? '').subscribe((list) => {
        this.followingList.set(list);
        this.showFollowingModal = true;
      });
    }
  }
}
