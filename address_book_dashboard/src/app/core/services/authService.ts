import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly APIUrl = environment.backApiUrl;

  // BehaviorSubject to keep track of the current user state (logged in / logged out)
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  private logoutTimer: any; // Timer for auto logout when the token expires

  constructor(
    private http: HttpClient,
    private router: Router,
    private toaster: ToastrService,
  ) {
    // Load user data from localStorage if available on service initialization
    this.loadUserDataFromStorage();
  }

  // 🔹 Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('AddressBookToken');
  }

  // 🔹 Save token in localStorage and start expiration timer
  setToken(token: string) {
    localStorage.setItem('AddressBookToken', token);
    this.startTokenTimer(token);
  }

  // 🔹 Load user session from storage, check if the token is expired or still valid
  private loadUserDataFromStorage() {
    const token = this.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        this.logout(); // If expired → logout immediately
      } else {
        this.userDataSubject.next(token); // If valid → update user state
        this.startTokenTimer(token); // Restart token timer
      }
    }
  }

  // 🔹 Update the BehaviorSubject with login state (e.g., after successful login)
  updateLoginState(model: any) {
    this.userDataSubject.next(model);
  }

  // 🔹 Clear the BehaviorSubject when logging out
  updateLogoutState() {
    this.userDataSubject.next(null);
  }

  // 🔹 Call backend API for login
  login(model: any) {
    return this.http.post(this.APIUrl + 'Auth/Login', model);
  }

  // 🔹 Call backend API for register
  register(model: any) {
    return this.http.post(this.APIUrl + 'Auth/SaveUser', model);
  }

  // 🔹 Logout: clear storage, stop timer, reset state, show toast, redirect to login page
  logout() {
    localStorage.clear();
    this.updateLogoutState();
    clearTimeout(this.logoutTimer);
    this.toaster.success('Logout Successfully');
    this.router.navigate(['']);
  }

  // ==============================
  // 🔑 TOKEN HANDLING
  // ==============================

  // 🔹 Decode JWT token (extract payload)
  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  // 🔹 Check if the token is expired
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    const expiryDate = decoded.exp * 1000; // convert seconds → milliseconds
    return Date.now() > expiryDate;
  }

  // 🔹 Start a timer based on token expiry, auto logout when it expires
  private startTokenTimer(token: string) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const expiresAt = decoded.exp * 1000;
    const timeout = expiresAt - Date.now();
    if (timeout > 0) {
      this.logoutTimer = setTimeout(() => {
        this.logout();
        this.toaster.warning('Session expired. Please log in again.');
      }, timeout);
    } else {
      this.logout();
    }
  }
}
