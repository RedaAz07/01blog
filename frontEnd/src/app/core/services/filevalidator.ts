import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Filevalidator {
  
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  validateFileSize(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  async validateRealMimeType(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      const blob = file.slice(0, 16);
      const reader = new FileReader();

      reader.onloadend = (e) => {
        if (!e.target?.result) {
          resolve(null);
          return;
        }

        const arr = new Uint8Array(e.target.result as ArrayBuffer);
        let hex = '';

        for (let i = 0; i < arr.length; i++) {
          hex += arr[i].toString(16).padStart(2, '0');
        }

        resolve(this.detectMimeType(hex));
      };

      reader.onerror = () => resolve(null);
      reader.readAsArrayBuffer(blob);
    });
  }

  private detectMimeType(hex: string): string | null {

    if (hex.startsWith('ffd8ff')) {
      return 'image/jpeg';
    }

    if (hex.startsWith('89504e47')) {
      return 'image/png';
    }

    if (
      hex.startsWith('52494646') &&
      hex.substring(16, 24) === '57454250'
    ) {
      return 'image/webp';
    }

    if (hex.substring(8, 16) === '66747970') {
      return 'video/mp4';
    }

    if (hex.startsWith('1a45dfa3')) {
      return 'video/webm';
    }

    return null;
  }
}