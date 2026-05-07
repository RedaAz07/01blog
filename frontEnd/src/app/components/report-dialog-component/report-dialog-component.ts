import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './report-dialog-component.html'
})
export class ReportDialogComponent {
  dialogRef = inject(MatDialogRef<ReportDialogComponent>);
  data = inject(MAT_DIALOG_DATA); // We pass the username or post title here!

  step: 'form' | 'confirm' = 'form';
  
  reportReasons = [
    'Spam or misleading',
    'Harassment or bullying',
    'Hate speech',
    'Impersonation',
    'Inappropriate content',
    'Other'
  ];
  
  reportReason = '';
  otherReason = '';

  isValid(): boolean {
    if (!this.reportReason) return false;
    if (this.reportReason === 'Other' && this.otherReason.trim().length < 5) return false;
    return true;
  }

  getFinalReason(): string {
    return this.reportReason === 'Other' ? this.otherReason.trim() : this.reportReason;
  }

  goToConfirm() {
    this.step = 'confirm';
  }

  submitFinal() {
    // When the user clicks "Yes, Report", we close the dialog and hand the text back to the parent!
    this.dialogRef.close(this.getFinalReason());
  }

  close() {
    this.dialogRef.close(); // Closes returning undefined
  }
}