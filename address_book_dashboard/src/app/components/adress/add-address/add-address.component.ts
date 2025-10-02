import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { Address } from '../../../core/models/Address';
import { AddressService } from '../../../core/services/AddressService';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { lastValueFrom } from 'rxjs';
import { JobService } from '../../../core/services/JobService';
import { DepartmentService } from '../../../core/services/DepartmentService';
import { Department } from '../../../core/models/Department';
import { Job } from '../../../core/models/Job';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent {
  @Input() AdressData?: Address;
  @Output() onCancel = new EventEmitter<Address>();
  showPassword: boolean = false;
  form: FormGroup;
  modalInstance: any | null = null;
  IsSpinner = false;
  jobs: Job[] = [];
  departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private toastr: ToastrService,
    private jobsService: JobService,
    private departmentService: DepartmentService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.loadDepartments();
    this.loadJobs();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      Id: [0],
      FullName: ['', [Validators.required, Validators.minLength(2)]],
      Email: ['', [Validators.required, Validators.email]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10,15}$/)]],
      DateOfBirth: [null, Validators.required],
      AddressLine: ['', [Validators.required, Validators.minLength(5)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Photo: ['', Validators.required],
      JobId: [null, Validators.required],
      DepartmentId: [null, Validators.required]
    });
  }

  async loadDepartments() {
    try {
      const res: any = await lastValueFrom(this.departmentService.getAllDepartments());
      if (res.State && res.Data && res.Data.length > 0) {
        this.departments = res.Data[0]; // Ensure array
      }
    } catch (error) {
      this.toastr.error('Failed to load departments');
      console.error(error);
    }
  }

  async loadJobs() {
    try {
      const res: any = await lastValueFrom(this.jobsService.getAllJobs());
      if (res.State && res.Data && res.Data.length > 0) {
        this.jobs = res.Data[0]; // Ensure array
      }
    } catch (error) {
      this.toastr.error('Failed to load jobs');
      console.error(error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['AdressData'] && this.AdressData) {
      const formData: any = { ...this.AdressData };

      // Patch DateOfBirth as Date object
      if (formData.DateOfBirth) {
        formData.DateOfBirth = new Date(formData.DateOfBirth);
      }

      this.form.patchValue(formData);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const modalElement = document.getElementById('addAdressModal');
      if (modalElement) {
        this.modalInstance = new Modal(modalElement, { backdrop: 'static', keyboard: false });
        this.openModal();
      } else {
        console.error('Modal element not found!');
      }
    });
  }

  openModal() {
    this.modalInstance?.show();
  }

  cancel() {
    this.modalInstance?.hide();
    this.onCancel.emit(new Address());
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Please fill all required fields correctly');
      return;
    }

    this.IsSpinner = true;

    try {
      const addressData = { ...this.form.value };

      // Ensure DateOfBirth is a Date object
      if (addressData.DateOfBirth) {
        addressData.DateOfBirth = new Date(addressData.DateOfBirth);
      }
      const res: any = await lastValueFrom(this.addressService.saveAdresses(addressData));
      if (res.State) {
        this.toastr.success('Address saved successfully');
        this.onCancel.emit(res.Data[0]);
        this.modalInstance?.hide();
      } else {
        this.toastr.error('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address', error);
      this.toastr.error('Failed to save address');
    } finally {
      this.IsSpinner = false;
    }
  }

  // File upload to Base64
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ Photo: reader.result as string });
        this.form.get('Photo')?.markAsTouched();
      };
      reader.readAsDataURL(file);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';
    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    if (field.errors['pattern']) return 'Please enter a valid format';
    return '';
  }
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

}
