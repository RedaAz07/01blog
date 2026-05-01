import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService, UserProfileDTO } from '../core/services/auth';
import { PostRequestDTO, PostResponseDTO, PostService } from '../core/services/post';
import { PostComponent } from './post-component/post-component';
import { PostFeed } from './post-feed/post-feed';
import { Observable } from 'rxjs/internal/Observable';
import { Follow } from '../core/services/follow';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class Home implements OnInit, AfterViewInit, OnDestroy {
  suggestedUsers = signal<any[]>([]);
  @ViewChild('scrollAnchor') set setupScrollAnchor(element: ElementRef) {
    if (element && this.observer) {
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
          { duration: 3000 }
        );
      },
      error: (err) => {
        console.error('Failed to toggle follow', err);
        
        user.followingBYMe = !user.followingBYMe;
        
        this.snackbar.open('Sorry, something went wrong. Please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }
  postModalOpen = false;
  editingPost: Post | null = null;

  openCreatePost(): void {
    this.editingPost = null;
    this.postModalOpen = true;
  }

  editPost(post: Post): void {
    this.editingPost = post;
    this.postModalOpen = true;
  }

  closePostModal(): void {
    this.postModalOpen = false;
    this.editingPost = null;
  }

  handlePostSave(postData: any): void {
    const requestPayload: PostRequestDTO = {
      title: postData.title,
      content: postData.content, // This is the Editor.js JSON string!
    };

    if (this.editingPost) {
    } else {
      this.postService.createPost(requestPayload).subscribe({
        next: (savedPostFromDB: PostResponseDTO) => {
          // Map the Database response to your Frontend Feed structure
          const newPost: Post = {
            id: savedPostFromDB.id,
            authorName: savedPostFromDB.author,
            title: savedPostFromDB.title,
            likes: savedPostFromDB.likesCount,
            liked: savedPostFromDB.liked,
            createdAt: new Date(savedPostFromDB.timestamp),
            comments: savedPostFromDB.commentsCount,
            content: savedPostFromDB.content,
          };

          /*    this.posts.unshift(newPost);
          this.currentUser.posts++; */

          this.closePostModal();
        },
        error: (err) => {
          console.error('Failed to save post:', err);
          alert('Sorry, something went wrong while saving your post. Please try again.');
        },
      });
    }

    // Close the modal when done!
    this.closePostModal();
  }


  private profileSidebarOpen = false;
  private showComments = false;
  ngOnInit(): void {
    this.loadMorePosts();
    this.suggestedUsers$ = this.followService.suggestedUsers();
  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1, // Triggers when 10% of the invisible div is on screen
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isLoading) {
        this.loadMorePosts();
      }
    }, options);
  }

  loadMorePosts(): void {
    if (this.isLoading) return; // Block spam clicks/scrolls

    this.isLoading = true; // Lock the door

    this.postService.fetchPosts(this.currentPage, 10).subscribe({
      next: () => {
        this.currentPage++; // Prep for the next time they hit the bottom
        this.isLoading = false; // Unlock the door
      },
      error: (err) => {
        console.error('Failed to fetch posts', err);
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
  onSearch(): void {
    /* wire to search service */
  }

  /*   deletePost(post: Post): void {
    this.posts = this.posts.filter((p) => p.id !== post.id);
    this.currentUser.posts = Math.max(0, this.currentUser.posts - 1);
  }
 */
  reportPost(post: Post): void {
    alert(`Post "${post.title}" has been reported. Thank you!`);
  }

  toggleLike(post: Post): void {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  
  /*   toggleFollow(user: SuggestedUser): void {
    user.following = !user.following;
    if (user.following) this.currentUser.following++;
    else this.currentUser.following = Math.max(0, this.currentUser.following - 1);
  }  */
}
