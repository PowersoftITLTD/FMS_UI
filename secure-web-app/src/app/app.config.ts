import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
// import { authReducer } from './store/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';

const authReducer = (state = { isLoggedIn: false }, action: any) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { isLoggedIn: true };
    case 'LOGOUT':
      return { isLoggedIn: false };
    default:
      return state;
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
     provideStore({ 
      auth: authReducer 
    }),
    //   provideStoreDevtools({
    //   maxAge: 25,
    //   logOnly: !isDevMode(),
    //   autoPause: true,
    //   trace: false,
    //   traceLimit: 75,
    //   connectInZone: true
    // }),
    provideEffects([]),
  ]
};
