import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
}

export interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string;
  mediaUrl?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  showComments: boolean;
  newComment: string;
  createdAt: Date;
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
    DatePipe
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  /* ── Current user ── */
  currentUser = {
    id: 1,
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: 'Writer, explorer, coffee addict ☕ | Sharing stories that matter.',
    posts: 48,
    followers: 1_240,
    following: 312
  };

  isAdmin = true; // toggle to hide dashboard link
  profileSidebarOpen = false;
  searchQuery = '';

  /* ── Post modal state ── */
  postModalOpen = false;
  editingPost: Post | null = null;
  postForm = { title: '', description: '', mediaPreview: '' as string | null };

  /* ── Feed ── */
  posts: Post[] = [
    {
      id: 1,
      authorId: 1,
      authorName: 'Sarah Johnson',
      authorAvatar: 'https://i.pravatar.cc/150?img=47',
      title: 'The Art of Slow Travel',
      description: 'Travel isn\'t about how many places you visit — it\'s about how deeply you experience each one. I spent three weeks in a single village in Portugal and came back transformed.',
      mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
      likes: 142,
      liked: false,
      comments: [
        { id: 1, author: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?img=12', text: 'This really resonates with me. Quality over quantity!' },
        { id: 2, author: 'Maya Chen', avatar: 'https://i.pravatar.cc/150?img=25', text: 'Portugal is absolutely magical. Which village?' }
      ],
      showComments: false,
      newComment: '',
      createdAt: new Date('2026-04-24T09:30:00')
    },
    {
      id: 2,
      authorId: 2,
      authorName: 'James Okafor',
      authorAvatar: 'https://i.pravatar.cc/150?img=15',
      title: 'Why I Quit My 6-Figure Job to Write',
      description: 'Everyone thought I was crazy. My family, my friends, my therapist. But eighteen months later, I\'ve never been more fulfilled. Here\'s what I learned about risk, identity, and what we owe ourselves.',
      likes: 389,
      liked: true,
      comments: [
        { id: 3, author: 'Emma Walsh', avatar: 'https://i.pravatar.cc/150?img=32', text: 'Incredibly brave. This is the kind of content I come here for.' }
      ],
      showComments: false,
      newComment: '',
      createdAt: new Date('2026-04-23T14:15:00')
    },
    {
      id: 3,
      authorId: 3,
      authorName: 'Lena Fischer',
      authorAvatar: 'https://i.pravatar.cc/150?img=44',
      title: 'Minimalist Photography: Less Is More',
      description: 'The most powerful images are often the simplest. A single subject. Negative space. No distractions. Learning to subtract until only truth remains.',
      mediaUrl: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?w=700&q=80',
      likes: 211,
      liked: false,
      comments: [],
      showComments: false,
      newComment: '',
      createdAt: new Date('2026-04-22T18:00:00')
    }
  ];

  /* ── Suggested Users ── */
  suggestedUsers: SuggestedUser[] = [
    { id: 10, name: 'Alex Rivera',   username: 'alexr',    avatar: 'https://i.pravatar.cc/150?img=12', following: false },
    { id: 11, name: 'Maya Chen',     username: 'mayac',    avatar: 'https://i.pravatar.cc/150?img=25', following: true  },
    { id: 12, name: 'Emma Walsh',    username: 'emmaw',    avatar: 'https://i.pravatar.cc/150?img=32', following: false },
    { id: 13, name: 'Carlos Vega',   username: 'carlosv',  avatar: 'https://i.pravatar.cc/150?img=53', following: false },
    { id: 14, name: 'Priya Sharma',  username: 'priyas',   avatar: 'https://i.pravatar.cc/150?img=60', following: false },
    { id: 15, name: 'Tom Nguyen',    username: 'tomn',     avatar: 'https://i.pravatar.cc/150?img=65', following: true  },
    { id: 16, name: 'Sofia Rossi',   username: 'sofiar',   avatar: 'https://i.pravatar.cc/150?img=49', following: false },
    { id: 17, name: 'Daniel Park',   username: 'danielp',  avatar: 'https://i.pravatar.cc/150?img=67', following: false },
    { id: 18, name: 'Isla Morgan',   username: 'islam',    avatar: 'https://i.pravatar.cc/150?img=56', following: false },
    { id: 19, name: 'Omar Farouq',   username: 'omarf',    avatar: 'https://i.pravatar.cc/150?img=70', following: false }
  ];

  ngOnInit(): void {}

  /* ── Navbar / Sidebar ── */
  toggleProfileSidebar(): void { this.profileSidebarOpen = !this.profileSidebarOpen; }
  closeProfileSidebar(): void  { this.profileSidebarOpen = false; }
  onSearch(): void { /* wire to search service */ }

  /* ── Post Modal ── */
  openCreatePost(): void {
    this.editingPost = null;
    this.postForm = { title: '', description: '', mediaPreview: null };
    this.postModalOpen = true;
  }

  editPost(post: Post): void {
    this.editingPost = post;
    this.postForm = {
      title: post.title,
      description: post.description,
      mediaPreview: post.mediaUrl || null
    };
    this.postModalOpen = true;
  }

  closePostModal(): void {
    this.postModalOpen = false;
    this.editingPost = null;
  }

  submitPost(): void {
    if (!this.postForm.title || !this.postForm.description) return;

    if (this.editingPost) {
      // Update
      this.editingPost.title = this.postForm.title;
      this.editingPost.description = this.postForm.description;
      this.editingPost.mediaUrl = this.postForm.mediaPreview || undefined;
    } else {
      // Create
      const newPost: Post = {
        id: Date.now(),
        authorId: this.currentUser.id,
        authorName: this.currentUser.name,
        authorAvatar: this.currentUser.avatar,
        title: this.postForm.title,
        description: this.postForm.description,
        mediaUrl: this.postForm.mediaPreview || undefined,
        likes: 0,
        liked: false,
        comments: [],
        showComments: false,
        newComment: '',
        createdAt: new Date()
      };
      this.posts.unshift(newPost);
      this.currentUser.posts++;
    }

    this.closePostModal();
  }

  onMediaSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { this.postForm.mediaPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  removeMedia(): void { this.postForm.mediaPreview = null; }

  /* ── Post actions ── */
  deletePost(post: Post): void {
    this.posts = this.posts.filter(p => p.id !== post.id);
    this.currentUser.posts = Math.max(0, this.currentUser.posts - 1);
  }

  reportPost(post: Post): void {
    alert(`Post "${post.title}" has been reported. Thank you!`);
  }

  toggleLike(post: Post): void {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  toggleComments(post: Post): void { post.showComments = !post.showComments; }

  addComment(post: Post): void {
    if (!post.newComment.trim()) return;
    post.comments.push({
      id: Date.now(),
      author: this.currentUser.name,
      avatar: this.currentUser.avatar,
      text: post.newComment.trim()
    });
    post.newComment = '';
  }

  /* ── Suggestions ── */
  toggleFollow(user: SuggestedUser): void {
    user.following = !user.following;
    if (user.following) this.currentUser.following++;
    else this.currentUser.following = Math.max(0, this.currentUser.following - 1);
  }
}