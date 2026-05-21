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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PostResponseDTO } from '../../core/services/post';
import { UserProfileDTO } from '../../core/services/auth';
import { Like, LikeResponseDTO } from '../../core/services/like';
import { Comment, CommentResponseDTO, CommentRequestDTO } from '../../core/services/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeAgoPipe } from '../../time-ago-pipe';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule, TimeAgoPipe, RouterLink],
  templateUrl: './post-feed.html',
  styleUrls: ['./post-feed.css'],
})
export class PostFeed implements OnInit, OnDestroy {
  private _post!: PostResponseDTO;

  @Input()
  set post(p: PostResponseDTO) {
    if (p) {
      p.nbrLikes = Number(p.nbrLikes) || 0;
      p.nbrComments = Number(p.nbrComments) || 0;
      p.imageUrls = p.imageUrls || [];
      this._post = p;
    }
  }

  get post(): PostResponseDTO {
    return this._post;
  }
  @Input() currentUser!: UserProfileDTO;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() report = new EventEmitter<any>();

  currentCommentPage = 0;
  isCommentsLoading = false;
  Comments = signal<CommentResponseDTO[]>([]);
  private commentObserver!: IntersectionObserver;

  @ViewChild('commentScrollAnchor') set setupCommentAnchor(element: ElementRef) {
    if (element) {
      if (this.commentObserver) this.commentObserver.disconnect();
      this.commentObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.isCommentsLoading) this.loadComments();
        },
        { root: null, rootMargin: '0px', threshold: 0.1 },
      );
      this.commentObserver.observe(element.nativeElement);
    }
  }

  constructor(
    private likeService: Like,
    private commentService: Comment,
    private dialog: MatDialog,
  ) {}

  snackbar = inject(MatSnackBar);
  showComments = false;
  newCommentText = '';

  currentSlide = 0;

  ngOnInit() {
    if (!this.post.imageUrls) {
      this.post.imageUrls = [];
    }
  }

  isVideo(url: string): boolean {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg');
  }

  toggleLike() {
    const wasLiked = this.post.isLiked;
    const oldLikesCount = this.post.nbrLikes;

    this.post.isLiked = !wasLiked;
    this.post.nbrLikes += this.post.isLiked ? 1 : -1;

    this.likeService.likePost(this.post.id).subscribe({
      next: (response: LikeResponseDTO) => {
        if (response) {
          const incomingLikes =
            response.nbLikes !== undefined ? response.nbLikes : response.nbLikes;

          this.post.isLiked = response.isLiked;
          this.post.nbrLikes = Number(incomingLikes) || 0;
        }
        this.snackbar.open(
          `this post ${response.isLiked ? 'Liked' : 'desliked seccefully'}`,
          'Close',
          { duration: 3000 },
        );
      },
      error: (error) => {
        
        this.post.isLiked = wasLiked;
        this.post.nbrLikes = oldLikesCount;
        this.snackbar.open('Failed to like this post', 'Close', { duration: 3000 });
      },
    });
  }

  toggleComments(post: any): void {
    this.showComments = !this.showComments;
    if (this.showComments) this.loadComments();
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
      error: () => (this.isCommentsLoading = false),
    });
  }

  ngOnDestroy() {
    if (this.commentObserver) this.commentObserver.disconnect();
  }

  addComment(post: any) {
    if (this.newCommentText.length < 3 || this.newCommentText.length > 100) {
      this.snackbar.open('must be between 3 and 100 comments ', 'close', { duration: 3000 });
      return
    }
    const commentData: CommentRequestDTO = { content: this.newCommentText, postId: post.id };
    this.commentService.createComment(commentData).subscribe({
      next: (createdComment) => {
        this.newCommentText = '';
        this.Comments.update((currentList) => [createdComment, ...currentList]);
        this.post.nbrComments++;
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

  OpenDeleteConfirmation(comment: CommentResponseDTO) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: { title: 'Delete Comment', message: `Permanently delete this comment?` },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.deleteComment(comment);
    });
  }

  deleteComment(comment: CommentResponseDTO) {
    this.commentService.deleteComment(comment.id).subscribe({
      next: () => {
        this.Comments.update((currentList) => currentList.filter((c) => c.id !== comment.id));
        this.post.nbrComments--;
      },
    });
  }

  // 🟢 Slider controls updated for imageUrls array
  prevSlide() {
    if (this.currentSlide > 0) this.currentSlide--;
  }
  nextSlide() {
    if (this.currentSlide < this.post.imageUrls.length - 1) this.currentSlide++;
  }
  goToSlide(i: number) {
    this.currentSlide = i;
  }
}
