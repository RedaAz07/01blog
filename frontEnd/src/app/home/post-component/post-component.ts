import { Component, EventEmitter, inject, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-component',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './post-component.html',
  styleUrl: './post-component.css',
})
export class PostComponent implements OnChanges {
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  @Input() editingPost: any | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  postTitle = '';
  postContent = ''; 
  selectedFiles: File[] = []; //

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.editingPost) {
        this.postTitle = this.editingPost.title;
        this.postContent = this.editingPost.content;
        this.selectedFiles = []; // Editing files usually requires a different UX flow
      } else {
        this.postTitle = '';
        this.postContent = '';
        this.selectedFiles = [];
      }
    }
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    
    if (this.selectedFiles.length + files.length > 5) {
      this.snackBar.open('You can only upload a maximum of 5 files!', 'Close', { duration: 3000 });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
    
    // Clear the input so they can select the same file again if they delete it
    event.target.value = ''; 
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
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
      files: this.selectedFiles // Pass the files to the manager!
    };

    this.save.emit(postData);
    this.closeModal();
  }
}