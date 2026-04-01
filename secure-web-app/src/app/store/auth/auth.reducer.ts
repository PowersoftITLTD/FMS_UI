// store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state, { authData }) => ({
    ...state,
     token: authData.token,  
    user: authData.user,
    isLoggedIn:true
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: '', 
    user: '',
    isLoggedIn:false
  }))
  // Add other actions as needed
);