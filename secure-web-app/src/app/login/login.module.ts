import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
// import { routes } from '../app.routes';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoginComponent,
    HttpClientModule
  ]
})
export class LoginModule { }
