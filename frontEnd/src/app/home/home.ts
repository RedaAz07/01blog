import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../core/services/auth';
import { PostRequestDTO, PostResponseDTO, PostService } from '../core/services/post';
import { PostComponent } from './post-component/post-component';
import { PostFeed } from './post-feed/post-feed';

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
export class Home implements OnInit {
  currentPage = 0;
  constructor(
    public authservice: AuthService,
    public postService: PostService,
  ) {}
  toggleFollow(user: any): void {
    user.following = !user.following;
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

  /* ── Suggested Users ── */
  suggestedUsers: SuggestedUser[] = [
    {
      id: 10,
      name: 'Alex Rivera',
      username: 'alexr',
      avatar: 'https://i.pravatar.cc/150?img=12',
      following: false,
    },
    {
      id: 11,
      name: 'Maya Chen',
      username: 'mayac',
      avatar: 'https://i.pravatar.cc/150?img=25',
      following: true,
    },
    {
      id: 12,
      name: 'Emma Walsh',
      username: 'emmaw',
      avatar: 'https://i.pravatar.cc/150?img=32',
      following: false,
    },
    {
      id: 13,
      name: 'Carlos Vega',
      username: 'carlosv',
      avatar: 'https://i.pravatar.cc/150?img=53',
      following: false,
    },
    {
      id: 14,
      name: 'Priya Sharma',
      username: 'priyas',
      avatar: 'https://i.pravatar.cc/150?img=60',
      following: false,
    },
    {
      id: 15,
      name: 'Tom Nguyen',
      username: 'tomn',
      avatar: 'https://i.pravatar.cc/150?img=65',
      following: true,
    },
    {
      id: 16,
      name: 'Sofia Rossi',
      username: 'sofiar',
      avatar: 'https://i.pravatar.cc/150?img=49',
      following: false,
    },
    {
      id: 17,
      name: 'Daniel Park',
      username: 'danielp',
      avatar: 'https://i.pravatar.cc/150?img=67',
      following: false,
    },
    {
      id: 18,
      name: 'Isla Morgan',
      username: 'islam',
      avatar: 'https://i.pravatar.cc/150?img=56',
      following: false,
    },
    {
      id: 19,
      name: 'Omar Farouq',
      username: 'omarf',
      avatar: 'https://i.pravatar.cc/150?img=70',
      following: false,
    },
  ];
  private profileSidebarOpen = false;
  private showComments = false;
  ngOnInit(): void {
    this.postService.fetchPosts(this.currentPage, 10).subscribe();
  }
  loadMorePosts(): void {
    this.currentPage++; 
    this.postService.fetchPosts(this.currentPage, 10).subscribe();
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

  toggleComments(post: Post): void {
    this.showComments = !this.showComments;
  }

  /* 
  toggleFollow(user: SuggestedUser): void {
    user.following = !user.following;
    if (user.following) this.currentUser.following++;
    else this.currentUser.following = Math.max(0, this.currentUser.following - 1);
  } */
}
