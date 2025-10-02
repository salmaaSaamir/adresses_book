import { Component } from '@angular/core';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddAddressComponent } from '../add-address/add-address.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Address, AddressDto } from '../../../core/models/Address';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from '../../../core/services/AddressService';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environment/environment';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-list-addresses',
  standalone: true,
  imports: [AddAddressComponent, CommonModule, LoaderComponent, FormsModule, MatTooltipModule, MatPaginatorModule,    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  providers: [DatePipe],
  templateUrl: './list-addresses.component.html',
  styleUrl: './list-addresses.component.css'
})
export class ListAddressesComponent {
  currentAddress: Address = new Address();
  IsaddAddress: boolean = false;
  IsSpinner: boolean = false;
  Addresss: Address[] = [];
  filteredAddresss: Address[] = [];
  pagedAddresss: Address[] = [];
  totalCount: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  ExcelData: Address[] = [];
  environment = environment.ImagesApiUrl;

  constructor(
    private toaster: ToastrService, 
    private AddressService: AddressService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.GetData();
  }

  async GetData() {
    try {
      this.IsSpinner = true;
      const res: any = await lastValueFrom(this.AddressService.getAdresses(this.currentPage + 1, this.pageSize));

      if (res.State) {
        const responseData = res.Data;
        this.totalCount = responseData[0];
        this.Addresss = responseData[3];
        this.applyFilters(); // Apply any existing filters
      }
    } catch (error) {
      this.toaster.error('Failed to load Addresses');
    } finally {
      this.IsSpinner = false;
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.GetData();
  }

  // Smart Search with Department, Job, and Date Range
  onSearch() {
    this.currentPage = 0;
    this.applyFilters();
  }

  private applyFilters() {
    if (!this.searchTerm.trim() && !this.startDate && !this.endDate) {
      this.filteredAddresss = [...this.Addresss];
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();

      this.filteredAddresss = this.Addresss.filter(address => {
        // Text search across multiple fields
        const textMatch = !this.searchTerm.trim() || 
          address.Id.toString().includes(searchLower) ||
          address.FullName?.toLowerCase().includes(searchLower) ||
          address.Email?.toLowerCase().includes(searchLower) ||
          address.MobileNumber?.includes(searchLower) ||
          address.AddressLine?.toLowerCase().includes(searchLower) ||
          address.Job?.Name?.toLowerCase().includes(searchLower) || // Search in Job Name
          address.Department?.Name?.toLowerCase().includes(searchLower) || // Search in Department Name
          address.Age.toString().includes(searchLower);

        // Date range filter
        const dateMatch = this.isDateInRange(address.DateOfBirth);

        return textMatch && dateMatch;
      });
    }

    this.updatePagedAddresss();
  }

  private isDateInRange(date: Date | string | null): boolean {
    if (!this.startDate && !this.endDate) {
      return true; // No date filter applied
    }

    if (!date) return false;

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) return false;

    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    // Set time to beginning and end of day for proper range comparison
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);
    targetDate.setHours(12, 0, 0, 0); // Neutral time for comparison

    if (start && end) {
      return targetDate >= start && targetDate <= end;
    } else if (start) {
      return targetDate >= start;
    } else if (end) {
      return targetDate <= end;
    }

    return true;
  }

  // TrackBy function for better performance
  trackByAddressId(index: number, address: Address): number {
    return address.Id;
  }

openModal(address?: Address) {
  console.log('Opening modal for address:', address);

  if (address) {
    const { Age, ...rest } = address; // exclude Age
    this.currentAddress = Object.assign(new Address(), rest);
  } else {
    this.currentAddress = new Address();
  }

  this.IsaddAddress = true;
}

  handleCancel(savedAddress?: Address) {
    this.IsaddAddress = false;
    if (savedAddress) {
      this.applyAddressChanges(savedAddress);
    }
  }

  // Apply Address changes to the local arrays
  private applyAddressChanges(savedAddress: Address) {
    const index = this.Addresss.findIndex(d => d.Id === savedAddress.Id);
    
    if (savedAddress.Id !== 0) {
      if (index > -1) {
        // Update existing address
        Object.assign(this.Addresss[index], savedAddress);
      } else {
        // Add new address
        this.Addresss.push(savedAddress); // Add to beginning
        this.totalCount++;
      }
    }

    this.applyFilters(); // Reapply filters after changes
  }

  // Update paged Addresses based on current pagination
  private updatePagedAddresss() {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedAddresss = this.filteredAddresss.slice(startIndex, startIndex + this.pageSize);
  }

  async deleteAddress(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Address will be permanently deleted.',
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
      const res: any = await lastValueFrom(this.AddressService.deleteAdresses(id));
      if (res) {
        this.toaster.success('Address deleted successfully');
        this.removeAddressFromArrays(id);
      }
    } catch (error) {
      this.toaster.error('Failed to Delete Address');
    } finally {
      this.IsSpinner = false;
    }
  }

  // Remove Address from local arrays
  private removeAddressFromArrays(id: number) {
    this.Addresss = this.Addresss.filter(d => d.Id !== id);
    this.filteredAddresss = this.filteredAddresss.filter(d => d.Id !== id);
    this.totalCount = Math.max(0, this.totalCount - 1);

    this.updatePagedAddresss();

    // If current page becomes empty and it's not the first page, go to previous page
    if (this.pagedAddresss.length === 0 && this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedAddresss();
    }
  }

  async ExportDataExcel() {
    try {
      this.IsSpinner = true;

      const result: any = await lastValueFrom(
        this.AddressService.getAllAdresses()
      );
      if (result.State) {
        const addresses = result.Data as AddressDto[];

        const exportData = addresses.map(addr => ({
          'ID': addr.Id,
          'Full Name': addr.FullName,
          'Address Line': addr.AddressLine,
          'Email': addr.Email,
          'Mobile': addr.MobileNumber,
          'Age': addr.Age,
          'Job': addr.JobName,
          'Department': addr.DepartmentName,
          'Date of Birth': this.datePipe.transform(addr.DateOfBirth, 'yyyy-MM-dd')
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Addresses');
        XLSX.writeFile(wb, 'Addresses_Report.xlsx');
      }

      this.IsSpinner = false;
    } catch (error) {
      this.toaster.error('Failed to export data!');
      this.IsSpinner = false;
    }
  }

  // Clear all filters
  clearFilters() {
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
    this.onSearch();
  }
  clearDateFilter() {
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
    this.onSearch();
  }
}