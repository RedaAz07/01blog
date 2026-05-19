import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filevalidator } from '../../core/services/filevalidator';
import { PostResponseDTO } from '../../core/services/post';

interface SelectedMedia {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-post-component',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './post-component.html',
  styleUrl: './post-component.scss',
})
export class PostComponent implements OnChanges {
  cdr = inject(ChangeDetectorRef);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  fileValidator = inject(Filevalidator);
  @Input() isSubmitting = false;
  @Input() editingPost: PostResponseDTO | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  postTitle = '';
  postContent = '';

  existingImageUrls: string[] = []; // Holds Cloudinary URLs
  selectedFiles: SelectedMedia[] = []; // Holds newly added files

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.selectedFiles.forEach((media) => URL.revokeObjectURL(media.previewUrl));
      this.selectedFiles = [];

      if (this.editingPost) {
        this.postTitle = this.editingPost.title;
        this.postContent = this.editingPost.content;
        this.existingImageUrls = [...(this.editingPost.imageUrls || [])];
      } else {
        this.postTitle = '';
        this.postContent = '';
        this.existingImageUrls = [];
      }
    }
  }

  async onFilesSelected(event: any) {
    if (this.isSubmitting) {
      event.target.value = '';
      return;
    }

    const files: FileList = event.target.files;

    const totalFiles = this.existingImageUrls.length + this.selectedFiles.length + files.length;
    if (totalFiles > 5) {
      this.snackBar.open('You can only have a maximum of 5 files total!', 'Close', { duration: 3000 });
      event.target.value = '';
      return;
    }

    const newValidFiles: SelectedMedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const realMimeType = await this.fileValidator.validateRealMimeType(file);

      if (!realMimeType) {
        this.snackBar.open(`File "${file.name}" is corrupted or invalid!`, 'Close', { duration: 5000 });
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newValidFiles.push({ file, previewUrl });
    }

    this.selectedFiles = [...this.selectedFiles, ...newValidFiles];
    this.cdr.detectChanges();
    event.target.value = '';
  }

  isVideo(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg');
  }

  removeExistingFile(index: number) {
    if (this.isSubmitting) return;
    this.existingImageUrls.splice(index, 1);
  }

  removeNewFile(index: number) {
    if (this.isSubmitting) return;
    const removedItem = this.selectedFiles.splice(index, 1)[0];
    URL.revokeObjectURL(removedItem.previewUrl);
  }

  closeModal() {
    if (this.isSubmitting) {
      return;
    }
    this.close.emit();
  }

  submitPost() {
    if (this.isSubmitting) {
      return;
    }

    if (!this.postTitle.trim() || !this.postContent.trim()) {
      this.snackBar.open('Title and Content are required!', 'Close', { duration: 3000 });
      return;
    }

    const postData = {
      title: this.postTitle,
      content: this.postContent,
      newFiles: this.selectedFiles.map((media) => media.file), // Raw files to upload
      retainedUrls: this.existingImageUrls, // URLs we want to keep
    };

    this.save.emit(postData);
    // this.closeModal();
  }
}
