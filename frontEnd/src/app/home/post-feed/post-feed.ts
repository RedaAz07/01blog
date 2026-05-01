import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  inject,
  signal,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PostResponseDTO } from '../../core/services/post';
import { UserProfileDTO } from '../../core/services/auth';
import { Like } from '../../core/services/like';
import { Comment, CommentResponseDTO } from '../../core/services/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentRequestDTO } from '../../core/services/comment';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule, DatePipe],
  templateUrl: './post-feed.html',
  styleUrls: ['./post-feed.css'],
})
export class PostFeed implements OnInit, OnDestroy {
  @Input() post: any;
  @Input() currentUser: any;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() report = new EventEmitter<any>();
  currentCommentPage = 0;
  isCommentsLoading = false;
  localLikeCount = signal<number>(0);
  localIsLiked = signal<boolean>(false);
  Comments = signal<CommentResponseDTO[]>([]);
  localCommentsCount = signal<number>(0);
  private commentObserver!: IntersectionObserver;
  @ViewChild('commentScrollAnchor') set setupCommentAnchor(element: ElementRef) {
    if (element && !this.commentObserver) {
      const options = { root: null, rootMargin: '0px', threshold: 0.1 };

      this.commentObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.isCommentsLoading) {
          this.loadComments();
        }
      }, options);

      this.commentObserver.observe(element.nativeElement);
    }
  }

  constructor(
    private likeService: Like,
    private commentService: Comment,
  ) {}
  snackbar = inject(MatSnackBar);
  parsedBlocks: any[] = [];
  showComments = false;
  newCommentText = '';

  mediaBlocks: any[] = [];
  textBlocks: any[] = [];
  currentSlide = 0;

  ngOnInit() {
    if (this.post) {
      this.localLikeCount.set(this.post.nbrLikes || 0);
      this.localIsLiked.set(this.post.isLiked || false);
      this.localCommentsCount.set(this.post.nbrComments || 0);
    }
    if (this.post && this.post.content) {
      try {
        const editorData = JSON.parse(this.post.content);
        this.parsedBlocks = editorData.blocks || [];
      } catch (e) {}
    }
    this.mediaBlocks = this.parsedBlocks.filter((b) => ['image', 'video'].includes(b.type));
    this.textBlocks = this.parsedBlocks.filter((b) => !['image', 'video'].includes(b.type));
  }

  toggleLike() {
    this.localIsLiked.update((liked) => !liked);
    this.localLikeCount.update((count) => (this.localIsLiked() ? count + 1 : count - 1));

    this.snackbar.open(this.localIsLiked() ? 'Post liked!' : 'Like removed', 'Close', {
      duration: 2000,
    });

    this.likeService.likePost(this.post.id).subscribe({
      next: (realCount) => {
        this.localLikeCount.set(realCount);
      },
      error: (error) => {
        console.error('Error liking post:', error);

        this.localIsLiked.update((liked) => !liked);
        this.localLikeCount.update((count) => (this.localIsLiked() ? count + 1 : count - 1));

        this.snackbar.open('Error liking post', 'Close', { duration: 3000 });
      },
    });
  }

  toggleComments(post: any) {
    this.showComments = !this.showComments;
    if (this.showComments) {
      this.loadComments();
    }
  }
  loadComments() {
    if (this.isCommentsLoading) return;

    this.isCommentsLoading = true;
    this.commentService.fetchComments(this.currentCommentPage, 5, this.post.id).subscribe({
      next: (response) => {
        this.currentCommentPage++;
        this.Comments.update((currentList) => [...currentList, ...response.content]);
        this.isCommentsLoading = false;
      },
      error: (error) => {
        this.isCommentsLoading = false;
      },
    });
  }
  ngOnDestroy() {
    if (this.commentObserver) {
      this.commentObserver.disconnect();
    }
  }
  addComment(post: any) {
    const commentData: CommentRequestDTO = {
      content: this.newCommentText,
      postId: post.id,
    };
    this.commentService.createComment(commentData).subscribe({
      next: (createdComment) => {
        this.localCommentsCount.update((count) => count + 1);
        this.newCommentText = '';
        this.snackbar.open('Comment added!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.snackbar.open('Error adding comment', 'Close', { duration: 3000 });
      },
    });
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

  prevSlide() {
    if (this.currentSlide > 0) this.currentSlide--;
  }
  nextSlide() {
    if (this.currentSlide < this.mediaBlocks.length - 1) this.currentSlide++;
  }
  goToSlide(i: number) {
    this.currentSlide = i;
  }
}
