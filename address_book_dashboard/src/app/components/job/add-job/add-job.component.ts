import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Job } from '../../../core/models/Job';
import { JobService } from '../../../core/services/JobService';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnChanges {
  @Input() jobData?: Job; // Input for editing
  @Output() onCancel = new EventEmitter<Job>(); // emit saved job or null on cancel

  form: FormGroup;
  isSpinner: boolean = false;
  modalInstance: any | null = null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  /** Detect changes on input (jobData) */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobData'] && this.jobData) {
      // Patch form safely before change detection
      this.form.patchValue(this.jobData);
    }
  }

  /** Initialize modal */
  ngAfterViewInit() {
    const modalElement = document.getElementById('addJobModal');
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
    this.onCancel.emit(this.jobData);
  }

  /** Save job */
  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSpinner = true;

    try {
      const job: Job = this.form.value;
      const res: any = await lastValueFrom(this.jobService.saveJob(job));

      if (res.State) {
        this.toastr.success('Saved successfully');
        this.onCancel.emit(res.Data[0]); // send saved job
        this.modalInstance?.hide();
      } else {
        this.toastr.error('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job', error);
      this.toastr.error('Failed to save job');
    } finally {
      this.isSpinner = false;
    }
  }
}
