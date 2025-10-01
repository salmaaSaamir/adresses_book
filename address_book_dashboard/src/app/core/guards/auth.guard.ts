import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('AddressBookToken');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();

      if (expiry > now) {
        return true; // token is valid
      } else {
        localStorage.removeItem('AddressBookToken');
        router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      localStorage.removeItem('AddressBookToken');
    }
  }

  router.navigate(['/login']);
  return false;
};
