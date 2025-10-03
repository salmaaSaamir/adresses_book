import { Component } from '@angular/core';
import { AuthService } from '../../core/services/authService';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  navLinks = [
    { label: 'Jobs', path: '/home' },
    { label: 'Departments', path: '/home/depts' },
    { label: 'Address', path: '/home/addresses' },

  ];

  isMenuOpen = false; 

  constructor(
    private authService: AuthService,
    private toaster: ToastrService
  ) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  LogOut() {
    this.authService.logout();
    this.closeMenu(); 
  }
}
