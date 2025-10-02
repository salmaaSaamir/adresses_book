import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  readonly APIUrl = environment.backApiUrl + 'Jobs/';

  constructor(private http: HttpClient) { }

  /** GET: Get paginated Jobs */
  getJobs(page: number = 1, pageSize: number = 20) {
    return this.http.get(`${this.APIUrl}GetJobs?page=${page}&pageSize=${pageSize}`);
  }

  /** GET: Get All Jobs */
  getAllJobs() {
    return this.http.get(`${this.APIUrl}GetAllJobs`);
  }

  /** POST: Add or update Job */
  saveJob(job: any) {
    return this.http.post(`${this.APIUrl}Save`, job);
  }

  /** DELETE: Delete a Job by Id */
  deleteJob(id: number) {
    return this.http.delete(`${this.APIUrl}Delete/${id}`);
  }
}
