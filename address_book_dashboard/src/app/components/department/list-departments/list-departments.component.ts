import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from '../../../core/services/DepartmentService';
import { Department } from '../../../core/models/Department';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AddDepartmentComponent } from '../add-department/add-department.component';

@Component({
  selector: 'app-list-departments',
  standalone: true,
  imports: [AddDepartmentComponent, CommonModule, LoaderComponent, FormsModule, MatTooltipModule, MatPaginatorModule],
  templateUrl: './list-departments.component.html',
  styleUrl: './list-departments.component.css'
})
export class ListDepartmentsComponent {
  currentDepartment: Department = new Department();
  IsaddDepartment: boolean = false;
  IsSpinner: boolean = false;
  Departments: Department[] = [];
  filteredDepartments: Department[] = [];
  pagedDepartments: Department[] = [];
  totalCount: number = 0;
  currentPage: number = 0; // MatPaginator uses 0-based index
  pageSize: number = 10;
  searchTerm: string = '';

  constructor(private toaster: ToastrService, private DepartmentService: DepartmentService) { }

  ngOnInit() {
    this.GetData();
  }

  async GetData() {
    try {
      this.IsSpinner = true;
      // API uses 1-based page index, so we add 1 to currentPage
      const res: any = await lastValueFrom(this.DepartmentService.getDepartments(this.currentPage + 1, this.pageSize));
      
      if (res.State) {
        // Parse the response data
        const responseData = res.Data
        this.totalCount = responseData[0];
        this.Departments = responseData[3];
        this.filteredDepartments = [...this.Departments];
        this.pagedDepartments = [...this.Departments];
      }
    } catch (error) {
      this.toaster.error('Failed to load Departments');
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
      this.filteredDepartments = [...this.Departments];
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();
      this.filteredDepartments = this.Departments.filter(department =>
        department.Id.toString().includes(searchLower) ||
        department.Name?.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 0; // Reset to first page when searching
    this.pagedDepartments = [...this.filteredDepartments]; // For client-side filtered results
  }

  // TrackBy function for better performance
  trackByDepartmentId(index: number, department: Department): number {
    return department.Id;
  }

  openModal(department?: Department) {
    this.currentDepartment = department ? { ...department } : new Department();
    this.IsaddDepartment = true;
  }

  handleCancel(savedDepartment?: Department) {
    this.IsaddDepartment = false;
    if (savedDepartment) {
      // Apply changes to the array instead of calling API
      this.applyDepartmentChanges(savedDepartment);
    }
  }

  // Apply department changes to the local arrays
  private applyDepartmentChanges(savedDepartment: Department) {
    const index = this.Departments.findIndex(d => d.Id === savedDepartment.Id);
    
    if(savedDepartment.Id !== 0) {
      if (index > -1) {
      // Update existing department
      this.Departments[index] = { ...savedDepartment };
    } else {
      // Add new department
      this.Departments.push({ ...savedDepartment });
      this.totalCount++; // Increment total count for new item
    }

    }
    // Update filtered and paged arrays
    this.filteredDepartments = [...this.Departments];
    this.updatePagedDepartments();
  }

  // Update paged departments based on current pagination
  private updatePagedDepartments() {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedDepartments = this.filteredDepartments.slice(startIndex, startIndex + this.pageSize);
  }

  async deleteDepartment(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Department will be permanently deleted.',
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
      const res: any = await lastValueFrom(this.DepartmentService.deleteDepartment(id));
      if (res) {
        this.toaster.success('Department deleted successfully');
        // Remove from local arrays instead of calling API
        this.removeDepartmentFromArrays(id);
      }else{
        this.toaster.error("Failed to Delete Department! Check its Usage in Adresses")
      }
    } catch (error) {
      this.toaster.error('Failed to Delete Department');
    } finally {
      this.IsSpinner = false;
    }
  }

  // Remove department from local arrays
  private removeDepartmentFromArrays(id: number) {
    this.Departments = this.Departments.filter(d => d.Id !== id);
    this.filteredDepartments = this.filteredDepartments.filter(d => d.Id !== id);
    this.totalCount = Math.max(0, this.totalCount - 1); // Decrement total count
    
    // Update paged departments
    this.updatePagedDepartments();

    // If current page becomes empty and it's not the first page, go to previous page
    if (this.pagedDepartments.length === 0 && this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedDepartments();
    }
  }
}