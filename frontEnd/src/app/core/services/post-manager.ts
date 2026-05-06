// src/app/core/services/post-manager.ts
import { inject, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService, PostRequestDTO, PostUpdateRequestDTO, PostResponseDTO } from './post'; 

export function usePostManager(postsSignal: WritableSignal<any[]>) {
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
            currentPosts.map((p) => (p.id === updatedPostFromDB.id ? updatedPostFromDB : p))
          );
          snackbar.open('Post updated successfully.', 'Close', { duration: 3000 });
          closePostModal();
        },
        error: (err) => snackbar.open('Failed to update post.', 'Close', { duration: 3000 }),
      });
    } else {
      postService.createPost(requestPayload).subscribe({
        next: (savedPostFromDB: PostResponseDTO) => {
          postsSignal.update((currentPosts) => [savedPostFromDB, ...currentPosts]);
          closePostModal();
        },
        error: (err) => alert('Sorry, something went wrong while saving your post. Please try again.'),
      });
    }
  };

  const reportPost = (post: any) => {
    const reason = prompt('Please enter the reason for reporting this post:');
    if (!reason) {
      snackbar.open('Report cancelled. Reason is required.', 'Close', { duration: 3000 });
      return;
    }

    const reportData = {
      reported: post.authorUsername,
      reportedPost: post.id,
      reason: reason,
    };

    postService.reportPost(reportData).subscribe({
      next: () => snackbar.open('Post reported successfully. Thank you for your feedback.', 'Close', { duration: 3000 }),
      error: (err) => snackbar.open('Sorry, something went wrong. Please try again.', 'Close', { duration: 3000 }),
    });
  };

  const deletePost = (post: any) => {
    if (confirm(`Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`)) {
      postService.deletePost(post.id).subscribe({
        next: () => {
          postsSignal.update((currentPosts) => currentPosts.filter((p) => p.id !== post.id));
          snackbar.open('Post deleted successfully.', 'Close', { duration: 3000 });
        },
        error: (err) => snackbar.open('Sorry, something went wrong. Please try again.', 'Close', { duration: 3000 }),
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
    deletePost
  };
}