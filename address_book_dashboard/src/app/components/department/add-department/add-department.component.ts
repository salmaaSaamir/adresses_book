import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Department } from '../../../core/models/Department';
import { DepartmentService } from '../../../core/services/DepartmentService';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css'
})
export class AddDepartmentComponent implements OnChanges {
 @Input() DepartmentData?: Department=new Department(); // Input for editing
  @Output() onCancel = new EventEmitter<Department>(); // emit saved Department or null on cancel

  form: FormGroup;
  isSpinner: boolean = false;
  modalInstance: any | null = null;

  constructor(
    private fb: FormBuilder,
    private DepartmentService: DepartmentService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  /** Detect changes on input (DepartmentData) */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['DepartmentData'] && this.DepartmentData) {
      // Patch form safely before change detection
      this.form.patchValue(this.DepartmentData);
    }
  }

  /** Initialize modal */
  ngAfterViewInit() {
    const modalElement = document.getElementById('addDepartmentModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, { backdrop: 'static', keyboard: false });
      this.openModal();
    }
  }

  /** Open modal */
  openModal() {
    this.modalInstance?.show();
  }

  /** Hide modal and emit cancel event */
  cancel() {
    this.modalInstance?.hide();
    this.onCancel.emit(this.DepartmentData);
  }

  /** Save Department */
  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSpinner = true;

    try {
      const Department: Department = this.form.value;
      const res: any = await lastValueFrom(this.DepartmentService.saveDepartment(Department));

      if (res.State) {
        this.toastr.success('Saved successfully');
        this.onCancel.emit(res.Data[0]); // send saved Department
        this.modalInstance?.hide();
      } else {
        this.toastr.error('Failed to save Department');
      }
    } catch (error) {
      console.error('Error saving Department', error);
      this.toastr.error('Failed to save Department');
    } finally {
      this.isSpinner = false;
    }
  }
}
