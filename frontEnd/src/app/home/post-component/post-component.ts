import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';

// Import Editor.js and tools
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import VideoTool from '@weekwood/editorjs-video';
import { AuthService } from '../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from '../home';
@Component({
  selector: 'app-post-component',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './post-component.html',
  styleUrl: './post-component.css',
})
export class PostComponent {
  snackBar = inject(MatSnackBar);
  @Input() editingPost: Post | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  postTitle = '';
  editor!: EditorJS;
  constructor(public authService: AuthService) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      
      if (this.editingPost) {

        this.postTitle = this.editingPost.title;

        if (this.editor && this.editingPost.content) {
          try {
            const parsedContent = JSON.parse(this.editingPost.content);
            
            this.editor.isReady.then(() => {
              this.editor.render(parsedContent);
            });
          } catch (error) {
            console.error('Failed to parse Editor.js content', error);
          }
        }
      } else {
        this.postTitle = '';
        
        if (this.editor) {
          this.editor.isReady.then(() => {
            this.editor.clear();
          });
        }
      }
    }
  }
  ngAfterViewInit() {
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
            field: 'file',
            additionalRequestHeaders: {
              Authorization: `Bearer ${token}`,
            },
          },
        },
        video: {
          class: VideoTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8080/api/media/editor-upload',
            },
            field: 'file',
            additionalRequestHeaders: {
              Authorization: `Bearer ${token}`,
            },
            player: {
              controls: true,
              autoplay: false,
            },
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
      console.log(outputData.blocks);

      if (
        outputData.blocks.length === 0 ||
        JSON.stringify(outputData).length < 5 ||
        JSON.stringify(outputData).length > 5000
      ) {
        this.snackBar.open('Post content must be between 5 and 5000 characters!', 'Close', {
          duration: 3000,
        });
        return;
      }
      if (!this.postTitle.trim() || this.postTitle.length < 5 || this.postTitle.length > 100) {
        this.snackBar.open('Post title must be between 5 and 100 characters!', 'Close', {
          duration: 3000,
        });
        return;
      }
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
