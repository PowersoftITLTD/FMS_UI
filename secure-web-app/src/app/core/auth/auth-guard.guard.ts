import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class noAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      return true;  // allow access to login if not logged in
    } else {
      this.router.navigate(['/']); // redirect if already logged in
      return false;
    }
  }
}
