import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/authService';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoaderComponent],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  passwordVisible = false;
  IsSpinner: boolean = false
  model = {
    Email: '',
    Password: '',
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
      this.IsSpinner = true
      const response: any = await lastValueFrom(this.authService.register(this.model));

      response.State
        ? this.toastr.success('Registration Successful') && this.router.navigate(['/login'])
        : this.toastr.error('Registration Failed! Please try again.');

      this.IsSpinner = false

    } catch (error) {
      console.error('Registration error:', error);
      this.toastr.error('Something went wrong. Please try again.');
    }
  }
}
