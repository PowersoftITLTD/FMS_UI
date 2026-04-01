import { Routes } from '@angular/router';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { ChangePasswordComponent } from './components/shared/change-password/change-password.component';
import { LoginComponent } from './login/login/login.component';
import { authGuard, noAuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard()] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard()] },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard()],
    children: [
      { path: 'dashboard', component: DashboardComponent },
    ]
  }
];
