import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/authService';
import { lastValueFrom } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoaderComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  passwordVisible = false;
  IsSpinner: boolean = false;
  model = {
    Email: '',
    Password: '',
    IsRememberMe: false,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) return;

    try {
      this.IsSpinner = true;
      const response: any = await lastValueFrom(this.authService.login(this.model));
      if (response.State) {
        this.toastr.success('Login Successful');

        // set token and optionally remember
        this.authService.setToken(response.token);
        this.router.navigate(['/home']);

      } else {
        this.toastr.error('Login Failed! Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.toastr.error('Something went wrong. Please try again.');
    } finally {
      this.IsSpinner = false;

    }
  }
}
