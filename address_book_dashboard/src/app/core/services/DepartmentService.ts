import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  readonly APIUrl = environment.backApiUrl + 'Departments/';

  constructor(private http: HttpClient) { }

  /** GET: Get paginated Departments */
  getDepartments(page: number = 1, pageSize: number = 20) {
    return this.http.get(`${this.APIUrl}GetDepartments?page=${page}&pageSize=${pageSize}`);
  }

  /** GET: Get All Departments */
  getAllDepartments() {
    return this.http.get(`${this.APIUrl}GetAllDepartments`);
  }

  /** POST: Add or update Department */
  saveDepartment(department: any) {
    return this.http.post(`${this.APIUrl}Save`, department);
  }

  /** DELETE: Delete a Department by Id */
  deleteDepartment(id: number) {
    return this.http.delete(`${this.APIUrl}Delete/${id}`);
  }
}
