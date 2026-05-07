import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <h2>Confirm</h2>
    <p>Are you sure you want to delete this post?</p>

    <button (click)="close(false)">Cancel</button>
    <button (click)="close(true)">Delete</button>
  `,
})
export class ConfirmDialog {
  dialogRef = inject(MatDialogRef<ConfirmDialog>);

  close(result: boolean) {
    this.dialogRef.close(result);
  }
} 