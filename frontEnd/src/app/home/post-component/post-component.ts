import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filevalidator } from '../../core/services/filevalidator';

interface SelectedMedia {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-post-component',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './post-component.html',
  styleUrl: './post-component.css',
})
export class PostComponent implements OnChanges {
  cdr = inject(ChangeDetectorRef); 
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  fileValidator = inject(Filevalidator);

  @Input() editingPost: any | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  postTitle = '';
  postContent = '';
  
  selectedFiles: SelectedMedia[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.editingPost) {
        this.postTitle = this.editingPost.title;
        this.postContent = this.editingPost.content;
      } else {
        this.postTitle = '';
        this.postContent = '';
      }
      // Reset files
      this.selectedFiles.forEach(media => URL.revokeObjectURL(media.previewUrl));
      this.selectedFiles = [];
    }
  }
async onFilesSelected(event: any) {
    const files: FileList = event.target.files;

    if (this.selectedFiles.length + files.length > 5) {
      this.snackBar.open('You can only upload a maximum of 5 files!', 'Close', { duration: 3000 });
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


  removeFile(index: number) {
    const removedItem = this.selectedFiles.splice(index, 1)[0];
    URL.revokeObjectURL(removedItem.previewUrl);
  }

  closeModal() {
    this.close.emit();
  }

  submitPost() {
    if (!this.postTitle.trim() || !this.postContent.trim()) {
      this.snackBar.open('Title and Content are required!', 'Close', { duration: 3000 });
      return;
    }

    const postData = {
      title: this.postTitle,
      content: this.postContent,
      files: this.selectedFiles.map(media => media.file), 
    };

    this.save.emit(postData);
    this.closeModal();
  }
}