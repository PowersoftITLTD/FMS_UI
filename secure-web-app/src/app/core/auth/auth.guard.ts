// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { storedDetails } from '../../store/auth/auth.selectors';

// Helper function to check authentication
function isAuthenticated(store: Store): Observable<boolean> {
  return store.select(storedDetails).pipe(
    tap((authState) => {
      console.log('authState authState: ', authState)
    }),
    map((authState) => {
      // Proper authentication check
      const isLoggedIn = authState?.isLoggedIn === true && 
                         authState?.token !== '' && 
                         authState?.token !== null;
      return isLoggedIn;
    })
  );
}

// NO-AUTH Guard (for login page)
export const noAuthGuard = (): CanActivateFn => {
  return (route, state) => {
    
    const router = inject(Router);
    const store = inject(Store);

    return isAuthenticated(store).pipe(
      tap((isLoggedIn) => {
        console.log('Check the login from noAuthGuard: ', isLoggedIn)
      }),
      map((isLoggedIn) => {
        if (isLoggedIn) {
                  console.log('coming to dashboard loggin ', isLoggedIn)
          router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  };
};

// AUTH Guard (for protected pages)
export const authGuard = (): CanActivateFn => {
  return (route, state) => {
    
    const router = inject(Router);
    const store = inject(Store);

    return isAuthenticated(store).pipe(
      tap((isLoggedIn) => {
        console.log('Check the login from authGuard: ', isLoggedIn)
      }),
      map((isLoggedIn) => {
        if (!isLoggedIn) {
                            console.log('back to loggin ', isLoggedIn)

          router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  };
};