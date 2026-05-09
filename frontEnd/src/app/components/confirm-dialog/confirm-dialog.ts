import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css'],
})
export class ConfirmDialog {
  dialogRef = inject(MatDialogRef<ConfirmDialog>);

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}