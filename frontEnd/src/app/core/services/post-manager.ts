// src/app/core/services/post-manager.ts
import { inject, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService, PostRequestDTO, PostUpdateRequestDTO, PostResponseDTO } from './post';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../../components/report-dialog-component/report-dialog-component';

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

  const handlePostSave = (postData: any) => {
    const requestPayload: PostRequestDTO = {
      title: postData.title,
      content: postData.content,
    };

    const currentEdit = editingPost();

    if (currentEdit) {
      const updatePayload: PostUpdateRequestDTO = {
        id: currentEdit.id,
        title: postData.title,
        content: postData.content,
      };

      postService.updatePost(updatePayload).subscribe({
        next: (updatedPostFromDB: PostResponseDTO) => {
          postsSignal.update((currentPosts) =>
            currentPosts.map((p) => (p.id === updatedPostFromDB.id ? updatedPostFromDB : p)),
          );
          snackbar.open('Post updated successfully.', 'Close', { duration: 3000 });
          closePostModal();
        },
        error: () => {},
      });
    } else {
      postService.createPost(requestPayload).subscribe({
        next: (savedPostFromDB: PostResponseDTO) => {
          postsSignal.update((currentPosts) => [savedPostFromDB, ...currentPosts]);
          closePostModal();
        },
        error: () => {},
      });
    }
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

  const deletePost = (post: any) => {
    if (
      confirm(
        `Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`,
      )
    ) {
      postService.deletePost(post.id).subscribe({
        next: () => {
          postsSignal.update((currentPosts) => currentPosts.filter((p) => p.id !== post.id));
          snackbar.open('Post deleted successfully.', 'Close', { duration: 3000 });
        },
        error: () => {},
      });
    }
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
