// src/app/core/services/post-manager.ts
import { inject, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService, PostResponseDTO } from './post';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../../components/report-dialog-component/report-dialog-component';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { finalize } from 'rxjs';

export function usePostManager(postsSignal: WritableSignal<any[]>) {
  const dialog = inject(MatDialog);
  const postService = inject(PostService);
  const snackbar = inject(MatSnackBar);

  const postModalOpen = signal(false);
  const editingPost = signal<any | null>(null);
  const isSubmitting = signal(false);
  const openCreatePost = () => {
    editingPost.set(null);
    postModalOpen.set(true);
  };

  const editPost = (post: any) => {
    editingPost.set(post);
    postModalOpen.set(true);
  };

  const closePostModal = (force = false) => {
    if (!force && isSubmitting()) {
      snackbar.open('Post is being submitted. Please wait...', 'Close', { duration: 2500 });
      return;
    }
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
    if (isSubmitting()) {
      return;
    }

    isSubmitting.set(true);
    const currentEdit = editingPost();
    if (currentEdit) {
      // ══════════════════════════════
      //  UPDATE POST LOGIC
      // ══════════════════════════════
      const formData = new FormData();
      formData.append('id', currentEdit.id);
      formData.append('title', postData.title);
      formData.append('content', postData.content);

      // Spring Boot expects "newFiles" for updates
      if (postData.newFiles && postData.newFiles.length > 0) {
        postData.newFiles.forEach((file: File) => {
          formData.append('newFiles', file);
        });
      }

      if (postData.retainedUrls && postData.retainedUrls.length > 0) {
        postData.retainedUrls.forEach((url: string) => {
          formData.append('retainedUrls', url);
        });
      }

      postService.updatePost(formData).pipe(
        finalize(() => isSubmitting.set(false)),
      ).subscribe({
        next: (savedPost: PostResponseDTO) => {
          postsSignal.update((currentPosts) =>
            currentPosts.map((p) => (p.id === savedPost.id ? savedPost : p)),
          );
          snackbar.open('Post updated successfully.', 'Close', { duration: 3000 });
          closePostModal(true);
        },
        error: (err) => {
          console.error(err);
          snackbar.open('Failed to update post.', 'Close', { duration: 3000 });
        },
      });
    } else {
      // ══════════════════════════════
      //  CREATE POST LOGIC
      // ══════════════════════════════
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);

      if (postData.newFiles && postData.newFiles.length > 0) {
        postData.newFiles.forEach((file: File) => {
          formData.append('files', file);
        });
      }

      postService.createPost(formData).pipe(
        finalize(() => isSubmitting.set(false)),
      ).subscribe({
        next: (savedPostFromDB: PostResponseDTO) => {
          postsSignal.update((currentPosts) => [savedPostFromDB, ...currentPosts]);
          snackbar.open('Post published successfully!', 'Close', { duration: 3000 });
          closePostModal(true);
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
    isSubmitting,
    reportPost,
    deletePost,
  };
}
