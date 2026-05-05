import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfileDTO } from '../core/services/auth';
import { PostResponseDTO, PostService } from '../core/services/post';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Follow } from '../core/services/follow';
import { Post } from '../home/home';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostFeed } from '../home/post-feed/post-feed';

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
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, PostFeed],
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
  Posts = signal<PostResponseDTO[]>([]);
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
      this.postService.fetchPostsByOwner(0, 10, username).subscribe({
        next: (response) => {
          this.Posts.set(response.content);
        },
        error: (err) => {
          console.log(err);
          this.snackbar.open('Failed to load posts for this user.', 'Close', { duration: 3000 });
        },
      });
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
  editingPost: Post | null = null;
  postModalOpen = false;

  editPost(post: Post): void {
    this.editingPost = post;
    this.postModalOpen = true;
    console.log(post);
  }

  reportPost(post: any): void {
    const reason = prompt('Please enter the reason for reporting this post:');
    if (!reason) {
      this.snackbar.open('Report cancelled. Reason is required.', 'Close', { duration: 3000 });
      return;
    }
    console.log(post);

    const reportData = {
      reported: post.authorUsername,
      reportedPost: post.id,
      reason: reason,
    };

    this.postService.reportPost(reportData).subscribe({
      next: () => {
        this.snackbar.open('Post reported successfully. Thank you for your feedback.', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackbar.open('Sorry, something went wrong. Please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  deletePost(post: Post): void {
    if (
      confirm(
        `Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`,
      )
    ) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          this.Posts.update((currentPosts) => currentPosts.filter((p) => p.id !== post.id));
          this.snackbar.open('Post deleted successfully.', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.snackbar.open('Sorry, something went wrong. Please try again.', 'Close', {
            duration: 3000,
          });
        },
      });
      this.Posts.update((currentPosts) => currentPosts.filter((p) => p.id !== post.id));

      this.snackbar.open('Post deleted successfully.', 'Close', { duration: 3000 });
    }
  }
}
