// src/app/core/services/post-manager.ts
import { inject, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService, PostRequestDTO, PostUpdateRequestDTO, PostResponseDTO } from './post';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../../components/report-dialog-component/report-dialog-component';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

export function usePostManager(postsSignal: WritableSignal<any[]>) {
  const dialog = inject(MatDialog);

  const postService = inject(PostService);
  const snackbar = inject(MatSnackBar);

  const postModalOpen = signal(false);
  const editingPost = signal<any | null>(null);

  const openCreatePost = () => {
    editingPost.set(null);
    postModalOpen.set(true);
  };

  const editPost = (post: any) => {
    editingPost.set(post);
    postModalOpen.set(true);
  };

  const closePostModal = () => {
    postModalOpen.set(false);
    editingPost.set(null);
  };


  const reportPost = (post: any) => {
    const dialogRef = dialog.open(ReportDialogComponent, {
      width: '400px',
      data: { targetName: '@' + post.id }, // Passes the username to the dialog UI
    });
    dialogRef.afterClosed().subscribe((finalReason: string) => {
      if (!finalReason) return;
      if (finalReason.trim().length < 5 || finalReason.trim().length > 100) {
        snackbar.open('Reasom must be between 5  and 100 charactere', 'Close', {
          duration: 5000,
        });
        return;
      }
      const reportData = {
        reported: post.authorUsername,
        reportedPost: post.id,
        reason: finalReason,
      };

      postService.reportPost(reportData).subscribe({
        next: () => snackbar.open('Post reported successfully!', 'Close', { duration: 3000 }),
        error: () => {},
      });
    });
  };



  const handlePostSave = (postData: any) => {
    
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);


    if (postData.files && postData.files.length > 0) {
      postData.files.forEach((file: File) => {
        formData.append('files', file);
      });
    }

    const currentEdit = editingPost();

    if (currentEdit) {
    } else {
      postService.createPost(formData).subscribe({
        next: (savedPostFromDB: PostResponseDTO) => {
          postsSignal.update((currentPosts) => [savedPostFromDB, ...currentPosts]);
          snackbar.open('Post published successfully!', 'Close', { duration: 3000 });
          closePostModal();
        },
        error: (err) => {
          console.error(err);
          snackbar.open('Failed to publish post', 'Close', { duration: 3000 });
        },
      });
    }
  };

  const deletePost = (post: any) => {
    const ref = dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `This action will permanently remove  this post. Continue?`,
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        postService.deletePost(post.id).subscribe({
          next: () => {
            postsSignal.update((currentPosts) => currentPosts.filter((p) => p.id !== post.id));
            snackbar.open('Post deleted successfully.', 'Close', { duration: 3000 });
          },
          error: () => {},
        });
      }
    });
  };

  return {
    postModalOpen,
    editingPost,
    openCreatePost,
    editPost,
    closePostModal,
    handlePostSave,
    reportPost,
    deletePost,
  };
}
