import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../../../services/auth/auth.service";

// error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('🔍 Error status:', error.status);
      
      if (error.status === 401) {
        console.log('🔐 Token expired or invalid');
        
        // Option A: Silent logout
        authService.logout();
        
        // Option B: Redirect to login
        router.navigate(['login'], {
          queryParams: { sessionExpired: true }
        });
        
        // Option C: Refresh token (if you have refresh token logic)
        // return authService.refreshToken().pipe(
        //   switchMap(() => next(req))
        // );
      }
      
      return throwError(() => error);
    })
  );
};