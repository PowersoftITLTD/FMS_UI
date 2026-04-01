import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { storedToken } from '../../store/auth/auth.selectors';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import _get from 'lodash/get';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor { // Added HttpInterceptor interface
  
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  store = inject(Store);
  
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor triggered for:', req.url);
    console.log('storedToken from interceptor service: ', storedToken)
    return this.store.select(storedToken).pipe(
      take(1),
      tap(token => console.log('Token retrieved:', token ? 'Present' : 'Not present')),
      switchMap((authToken) => {
        console.log('Original headers:', req.headers.keys());
        
        const modifiedReq = authToken 
          ? req.clone({
              headers: req.headers.set('Authorization', `Bearer ${authToken}`),
            })
          : req;
        
        console.log('Modified headers:', modifiedReq.headers.keys());
        console.log('Authorization header:', modifiedReq.headers.get('Authorization'));
        
        // Handle the HTTP request and catch its errors here
        return next.handle(modifiedReq).pipe(
          tap(event => console.log('HTTP Event type:', event.type)),
          catchError((error: HttpErrorResponse) => {
            console.error('Interceptor caught HTTP error:', error);
            return this.errorHandler(error);
          })
        );
      })
      // Note: catchError is removed from here - it's now inside switchMap
    );
  }

  private errorHandler(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    const { status, error: apiError } = error;

    // Silent logout for unauthorized or network failure
    if (status === 401 || status === 0) {
      this.authService.logout();
      // No error toast for these cases
      return throwError(() => new Error('Unauthorized or network error'));
    }

    // Show error message for all other errors
    let errorMessage =
      _get(apiError, 'Data.message') ||
      _get(apiError, 'message') ||
      _get(apiError, 'title') ||
      'Something went wrong. Please try again later.';

    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}