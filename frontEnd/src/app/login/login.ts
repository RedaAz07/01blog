import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true, // Make sure you have this if you are using 'imports: []'
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  loginForm!: FormGroup; 

  errorMessage: string = ''; 
  
  snackbar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value; // (Spelling fix: credentials)

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
        this.snackbar.open('Login successful!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        let errMsg = err.error?.message || 'bad credentials';
        this.snackbar.open('Login failed: ' + errMsg, 'Close', { duration: 5000 });
      },
    });
  }
}