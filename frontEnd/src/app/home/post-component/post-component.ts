import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';

// Import Editor.js and tools
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import { AuthService } from '../../core/services/auth';
@Component({
  selector: 'app-post-component',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './post-component.html',
  styleUrl: './post-component.css',
})
export class PostComponent {
  @Input() isOpen = false;
  @Input() editingPost = false;
  @Output() close = new EventEmitter<void>();

  // 3. Sends the final data back to Home to be saved
  @Output() save = new EventEmitter<any>();
  postTitle = '';
  editor!: EditorJS;
  constructor(public authService: AuthService) {}



ngAfterViewInit() {
    // Grab the token manually!
    const token = localStorage.getItem('jwt_token');

    this.editor = new EditorJS({
      holder: 'editorjs',
      placeholder: 'What is on your mind, bro? Type here or click + for images...',
      tools: {
        header: Header,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8080/api/media/editor-upload',
            },
            field: 'image',
            additionalRequestHeaders: {
              'Authorization': `Bearer ${token}` 
            }
          },
        },
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  async submitPost() {
    try {
      const outputData = await this.editor.save();

      const postData = {
        title: this.postTitle,
        content: JSON.stringify(outputData),
      };

      this.save.emit(postData);

      this.postTitle = '';
      this.editor.clear();
      this.closeModal();
    } catch (error) {
      console.error('Saving failed: ', error);
    }
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
