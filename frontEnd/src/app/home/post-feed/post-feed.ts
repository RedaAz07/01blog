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
import { Like, LikeResponseDTO } from '../../core/services/like';
import { Comment, CommentResponseDTO } from '../../core/services/comment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentRequestDTO } from '../../core/services/comment';
import { TimeAgoPipe } from '../../time-ago-pipe';
import { R } from '@angular/cdk/keycodes';
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
  @Input() post!: PostResponseDTO;
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
      if (this.commentObserver) {
        this.commentObserver.disconnect();
      }

      this.commentObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.isCommentsLoading) {
            this.loadComments();
          }
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
  parsedBlocks: any[] = [];
  showComments = false;
  newCommentText = '';
  mediaBlocks: any[] = [];
  textBlocks: any[] = [];
  currentSlide = 0;

  ngOnInit() {
    
    this.post.nbrComments = Number(this.post.nbrComments) || 0;

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
   
    this.likeService.likePost(this.post.id).subscribe({
      next: (response: LikeResponseDTO) => {
        this.post.nbrLikes = response.nbLikes;
        this.post.isLiked = response.isLiked;
        this.snackbar.open(`post ${response.isLiked? 'liked' : 'disliked'} succefully`,'close',{duration:3000})
      },
      error: (error) => {
 
        this.snackbar.open(`faild to like this post `,'close',{duration:3000})

      },
    });
  }

  toggleComments(post: any): void {
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
        this.newCommentText = '';
        this.Comments.update((currentList) => [createdComment, ...currentList]);

        this.post.nbrComments++;

        this.snackbar.open('Comment added!', 'Close', { duration: 2000 });
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
      data: {
        title: 'Delete User',
        message: `This action will permanently delete thid comment . Continue?`,
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteComment(comment);
      }
    });
  }
  deleteComment(comment: CommentResponseDTO) {
    this.commentService.deleteComment(comment.id).subscribe({
      next: () => {
        this.Comments.update((currentList) => currentList.filter((c) => c.id !== comment.id));
        this.post.nbrComments--;

        this.snackbar.open('Comment deleted!', 'Close', { duration: 2000 });
      },
    });
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
