import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-post-feed',
  standalone: true, 
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule, DatePipe],
  templateUrl: './post-feed.html',
  styleUrls: ['./post-feed.css'],
})
export class PostFeed implements OnInit {
  @Input() post: any;
  @Input() currentUser: any;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() report = new EventEmitter<any>();

  parsedBlocks: any[] = [];
  showComments = false;
  newCommentText = '';

  ngOnInit() {
    if (this.post && this.post.content) {
      try {
        const editorData = JSON.parse(this.post.content);
        this.parsedBlocks = editorData.blocks || [];
      } catch (e) {
        console.error("Failed to parse Editor.js content", e);
      }
    }
  }

  toggleComments(post: any) {
    this.showComments = !this.showComments;
  }

  toggleLike(post: any) {
    post.liked = !post.liked;
    post.likes = post.liked ? (post.likes || 0) + 1 : (post.likes || 0) - 1;
  }

  addComment(post: any) {
    if (!this.newCommentText.trim()) return;
    
    if (!post.commentsList) post.commentsList = [];
    post.commentsList.push({
      id: Date.now(),
      author: this.currentUser?.username || 'Me',
      avatar: this.currentUser?.avatar || 'assets/default-avatar.png',
      text: this.newCommentText.trim()
    });
    this.newCommentText = '';
  }

  editPost(post: any) {
    this.edit.emit(post);
  }

  deletePost(post: any) {
    this.delete.emit(post);
  }

  reportPost(post: any) {
    this.report.emit(post);
  }
}