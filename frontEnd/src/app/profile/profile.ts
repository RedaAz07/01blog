import {
  Component,
  Input,
  OnInit,
  signal,
  computed,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
import { PostComponent } from '../home/post-component/post-component';
import { usePostManager } from '../core/services/post-manager';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../components/report-dialog-component/report-dialog-component';

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
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, PostFeed, PostComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  isPostLoading = false;
  private postObserver!: IntersectionObserver;

  @ViewChild('postScrollAnchor') set setupPostAnchor(element: ElementRef) {
    if (element && !this.postObserver) {
      const options = { root: null, rootMargin: '0px', threshold: 0.1 };

      this.postObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.isPostLoading) {
          this.route.params.subscribe((params) => {
            const username = params['username'];
            this.loadPosts(username);
          });
        }
      }, options);

      this.postObserver.observe(element.nativeElement);
    }
  }
  dialog = inject(MatDialog);
  constructor(
    public authService: AuthService,
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    public followService: Follow,
    public postsService: PostService,
  ) {}
  snackbar = inject(MatSnackBar);
  currentPostPage = 0;

  user = signal<UserProfile | null>(null);
  currentUser = signal<UserProfile | null>(null);
  isCurrentUser = computed(() => {
    const pUser = this.user();
    const cUser = this.currentUser();
    return pUser != null && cUser != null && pUser.username === cUser.username;
  });
  followersList = signal<{ username: string; avatar: string }[]>([]);
  followingList = signal<{ username: string; avatar: string }[]>([]);
  Posts = signal<PostResponseDTO[]>([]);
  postManager = usePostManager(this.Posts);

  isFollowing = signal(false);
  showEditModal = false;
  showFollowersModal = false;
  showFollowingModal = false;
  showReportModal = false;
  showOtherREport = false;
  editForm: Partial<UserProfile> = {};

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const username = params['username'];
      this.loadUserProfile(username);
      this.loadPosts(username);
    });

    this.authService.currentUser$.subscribe((profile) => {
      this.currentUser.set(profile);
    });
  }

  loadPosts(username: string): void {
    if (this.isPostLoading) return;

    this.isPostLoading = true;

    this.postService.fetchPostsByOwner(this.currentPostPage, 10, username).subscribe({
      next: (response) => {
        this.currentPostPage++;
        this.Posts.update((currentPosts) => [...currentPosts, ...response.content]);
        this.isPostLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isPostLoading = false;
      },
    });
  }
  ngOnDestroy() {
    if (this.postObserver) {
      this.postObserver.disconnect();
    }
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
      error: () => {},
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
      error: () => {},
    });
  }

  submitReport(): void {
    const targetUser = this.user()?.username;
    if (!targetUser) return;

    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px',
      data: { targetName: '@' + targetUser }, // Passes the username to the dialog UI
    });

    dialogRef.afterClosed().subscribe((finalReason: string) => {
      if (!finalReason) return;
      if (finalReason.trim().length < 5 || finalReason.trim().length > 100) {
        this.snackbar.open('Reasom must be between 5  and 100 charactere', 'Close', {
          duration: 5000,
        });
        return;
      }

      // 3. If they gave us a reason, fire the HTTP request!
      this.postService
        .reportPost({
          reported: targetUser,
          reason: finalReason,
        })
        .subscribe({
          next: () =>
            this.snackbar.open('User reported successfully!', 'Close', { duration: 3000 }),
          error: () => {},
        });
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
