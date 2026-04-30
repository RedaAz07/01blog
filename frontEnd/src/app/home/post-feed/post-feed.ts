import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PostResponseDTO } from '../../core/services/post';
import { UserProfileDTO } from '../../core/services/auth';
import { Like } from '../../core/services/like';

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

  @Output() edit   = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() report = new EventEmitter<any>();

  constructor(private likeService: Like) {}

  parsedBlocks: any[] = [];
  showComments  = false;
  newCommentText = '';

  // ── ADDED for slider ──
  mediaBlocks: any[] = [];
  textBlocks:  any[] = [];
  currentSlide = 0;
  // ─────────────────────

  ngOnInit() {
    if (this.post && this.post.content) {
      try {
        const editorData = JSON.parse(this.post.content);
        this.parsedBlocks = editorData.blocks || [];
      } catch (e) {}
    }

    // ── ADDED: split blocks into media vs text ──
    this.mediaBlocks = this.parsedBlocks.filter(b => ['image', 'video'].includes(b.type));
    this.textBlocks  = this.parsedBlocks.filter(b => !['image', 'video'].includes(b.type));
    // ───────────────────────────────────────────
  }

  toggleComments(post: any) { this.showComments = !this.showComments; }

  toggleLike(post: any) {
    this.likeService.likePost(post.id).subscribe((res) => {
      post.liked = !post.liked;
      post.likesCount = res.likesCount;
    });
  }

  addComment(post: any) { /* your existing commented code */ }

  editPost(post: any)   { this.edit.emit(post); }
  deletePost(post: any) { this.delete.emit(post); }
  reportPost(post: any) { this.report.emit(post); }

  // ── ADDED: slider controls ──
  prevSlide() { if (this.currentSlide > 0) this.currentSlide--; }
  nextSlide() { if (this.currentSlide < this.mediaBlocks.length - 1) this.currentSlide++; }
  goToSlide(i: number) { this.currentSlide = i; }
  // ───────────────────────────
}