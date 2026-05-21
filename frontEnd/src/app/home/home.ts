import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService, UserProfileDTO } from '../core/services/auth';
import {
  PageResponse,
  PostRequestDTO,
  PostResponseDTO,
  PostService,
  PostUpdateRequestDTO,
} from '../core/services/post';
import { PostComponent } from './post-component/post-component';
import { PostFeed } from './post-feed/post-feed';
import { Observable } from 'rxjs/internal/Observable';
import { Follow } from '../core/services/follow';
import { MatSnackBar } from '@angular/material/snack-bar';
import { usePostManager } from '../core/services/post-manager';

export interface Post {
  id: number;
  authorName: string;
  title: string;
  likes: number;
  liked: boolean;
  createdAt: Date;
  content: string;
  comments: number;
}

export interface SuggestedUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
  following: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    PostComponent,
    PostFeed,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
  Posts = signal<PostResponseDTO[]>([]);
  postManager = usePostManager(this.Posts);
  suggestedUsers = signal<any[]>([]);
  @ViewChild('scrollAnchor') set setupScrollAnchor(element: ElementRef) {
    if (element) {
      if (this.observer) {
        this.observer.disconnect();
      }
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.isLoading) {
          this.loadMorePosts();
        }
      }, { root: null, rootMargin: '0px', threshold: 0.1 });
      this.observer.observe(element.nativeElement);
    }
  }
  snackbar = inject(MatSnackBar);
  suggestedUsers$!: Observable<UserProfileDTO[]>;
  private observer!: IntersectionObserver;
  currentPage = 0;
  isLoading = false;
  constructor(
    public authservice: AuthService,
    public postService: PostService,
    public followService: Follow,
  ) {}

  toggleFollow(user: any): void {
    user.followingBYMe = !user.followingBYMe;
    this.followService.toggleFollow(user.username).subscribe({
      next: () => {
        this.snackbar.open(
          user.followingBYMe
            ? `You are now following ${user.username}`
            : `You have unfollowed ${user.username}`,
          'Close',
          { duration: 3000 },
        );
      },
      error: (err) => {

        user.followingBYMe = !user.followingBYMe;
      },
    });
  }

  private profileSidebarOpen = false;
  private showComments = false;
  ngOnInit(): void {
    this.loadMorePosts();
    this.suggestedUsers$ = this.followService.suggestedUsers();
  }



  loadMorePosts(): void {
    if (this.isLoading) return; // Block spam clicks/scrolls

    this.isLoading = true; // Lock the door

    this.postService.fetchPosts(this.currentPage, 10).subscribe({
      next: (newPosts: any) => {
        this.Posts.update((currentPosts) => [...currentPosts, ...newPosts.content]);
        this.currentPage++;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false; // Unlock the door even on error!
      },
    });
  }
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggleProfileSidebar(): void {
    this.profileSidebarOpen = !this.profileSidebarOpen;
  }
  closeProfileSidebar(): void {
    this.profileSidebarOpen = false;
  }
}
