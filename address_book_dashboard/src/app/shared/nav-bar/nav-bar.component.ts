import { Component } from '@angular/core';
import { AuthService } from '../../core/services/authService';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private authService: AuthService, private toaster: ToastrService) { }
  LogOut() {
    this.authService.logout();
  }
}
