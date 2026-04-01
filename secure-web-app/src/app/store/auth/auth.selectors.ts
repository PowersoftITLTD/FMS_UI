// store/auth/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Get the entire auth state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Get stored details
export const storedDetails = createSelector(
  selectAuthState,
  (state: AuthState) => state
);


export const storedToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);
// Better: Create a proper isAuthenticated selector
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => {
    const isAuthenticated = state.isLoggedIn && 
                           state.token && 
                           state.token.length > 0;
    console.log('🔍 SELECTOR: Checking authentication', { state, isAuthenticated });
    return isAuthenticated;
  }
);