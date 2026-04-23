import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public authService: AuthService) {}
}
