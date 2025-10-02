import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AddressService {
  readonly APIUrl = environment.backApiUrl + 'Adresses/';

  constructor(private http: HttpClient) { }

  /** GET: Get paginated Adresses */
  getAdresses(page: number = 1, pageSize: number = 20) {
    return this.http.get(`${this.APIUrl}GetAdresses?page=${page}&pageSize=${pageSize}`);
  }

  /** GET: Get All Adresses */
  getAllAdresses() {
    return this.http.get(`${this.APIUrl}GetAllAddresses`);
  }

  /** POST: Add or update Adresses */
  saveAdresses(Adresses: any) {
    return this.http.post(`${this.APIUrl}Save`, Adresses);
  }

  /** DELETE: Delete a Adresses by Id */
  deleteAdresses(id: number) {
    return this.http.delete(`${this.APIUrl}Delete/${id}`);
  }
}
