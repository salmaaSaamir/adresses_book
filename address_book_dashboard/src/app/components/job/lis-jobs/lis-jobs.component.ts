import { Component } from '@angular/core';
import { AddJobComponent } from '../add-job/add-job.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { ToastrService } from 'ngx-toastr';
import { JobService } from '../../../core/services/JobService';
import { Job } from '../../../core/models/Job';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-lis-jobs',
  standalone: true,
  imports: [AddJobComponent, CommonModule, LoaderComponent, FormsModule, MatTooltipModule, MatPaginatorModule],
  templateUrl: './lis-jobs.component.html',
  styleUrl: './lis-jobs.component.css'
})
export class LisJobsComponent {
  currentJob: Job = new Job();
  IsaddJob: boolean = false;
  IsSpinner: boolean = false;
  Jobs: Job[] = [];
  filteredJobs: Job[] = [];
  pagedJobs: Job[] = [];
  totalCount: number = 0;
  currentPage: number = 0; // MatPaginator uses 0-based index
  pageSize: number = 10;
  searchTerm: string = '';

  constructor(private toaster: ToastrService, private JobService: JobService) { }

  ngOnInit() {
    this.GetData();
  }

  async GetData() {
    try {
      this.IsSpinner = true;
      // API uses 1-based page index, so we add 1 to currentPage
      const res: any = await lastValueFrom(this.JobService.getJobs(this.currentPage + 1, this.pageSize));

      if (res.State) {
        // Parse the response data
        const responseData = res.Data
        this.totalCount = responseData[0];
        this.Jobs = responseData[3];
        this.filteredJobs = [...this.Jobs];
        this.pagedJobs = [...this.Jobs];
      }
    } catch (error) {
      this.toaster.error('Failed to load Jobs');
    } finally {
      this.IsSpinner = false;
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.GetData(); // Fetch new data from API when page changes
  }

  // Search - Client-side filtering
  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredJobs = [...this.Jobs];
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();
      this.filteredJobs = this.Jobs.filter(Job =>
        Job.Id.toString().includes(searchLower) ||
        Job.Name?.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 0; // Reset to first page when searching
    this.pagedJobs = [...this.filteredJobs]; // For client-side filtered results
  }

  // TrackBy function for better performance
  trackByJobId(index: number, Job: Job): number {
    return Job.Id;
  }

  openModal(job?: Job) {
    this.currentJob = job ? { ...job } : new Job();
    this.IsaddJob = true;
  }

  handleCancel(savedJob?: Job) {
    this.IsaddJob = false;
    if (savedJob) {
      // Apply changes to the array instead of calling API
      this.applyJobChanges(savedJob);
    }
  }

  // Apply Job changes to the local arrays
  private applyJobChanges(savedJob: Job) {
    const index = this.Jobs.findIndex(d => d.Id === savedJob.Id);
    if (savedJob.Id !== 0) {

      if (index > -1) {
        // Update existing Job
        this.Jobs[index] = { ...savedJob };
      } else {
        // Add new Job
        this.Jobs.push({ ...savedJob });
        this.totalCount++; // Increment total count for new item
      }
    }
    // Update filtered and paged arrays
    this.filteredJobs = [...this.Jobs];
    this.updatePagedJobs();
  }

  // Update paged Jobs based on current pagination
  private updatePagedJobs() {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedJobs = this.filteredJobs.slice(startIndex, startIndex + this.pageSize);
  }

  async deleteJob(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Job will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      await this.DeleteFromApi(id);
    }
  }

  async DeleteFromApi(id: number) {
    try {
      this.IsSpinner = true;
      const res: any = await lastValueFrom(this.JobService.deleteJob(id));
      if (res) {
        this.toaster.success('Job deleted successfully');
        // Remove from local arrays instead of calling API
        this.removeJobFromArrays(id);
      }
      else{
        this.toaster.error("Failed to Delete Job! Check its Usage in Adresses")
      }
    } catch (error) {
      this.toaster.error('Failed to Delete Job');
    } finally {
      this.IsSpinner = false;
    }
  }

  // Remove Job from local arrays
  private removeJobFromArrays(id: number) {
    this.Jobs = this.Jobs.filter(d => d.Id !== id);
    this.filteredJobs = this.filteredJobs.filter(d => d.Id !== id);
    this.totalCount = Math.max(0, this.totalCount - 1); // Decrement total count

    // Update paged Jobs
    this.updatePagedJobs();

    // If current page becomes empty and it's not the first page, go to previous page
    if (this.pagedJobs.length === 0 && this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedJobs();
    }
  }
}
