import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

// PrimeNG modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

// import * as CryptoJS from 'crypto-js';

// Reactive Form Imports
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { ToasterContainerComponent } from '../../components/shared/toaster-container/toaster-container.component';
import { ToasterService } from '../../services/toaster/toaster.service';
import { SecureStorageService } from '../../services/secure/secure-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    // ToasterContainerComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  error = '';
  loginSuccess: boolean = false;
  isForgotEmail: boolean = false; // To toggle between forms
  
  // This key must exactly match what C# expects

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private toaster: ToasterService,
    private secureStorage:SecureStorageService
  ) {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.forgotPasswordForm = new FormGroup({
      email:new FormControl('', [Validators.required])
    })

  }

get f() {
  return this.loginForm.controls;
}

get e() {
  return this.forgotPasswordForm.controls;
}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;


    try {
      const combined = `${username}:${password}`;      
      this.auth.login(combined, username, password).subscribe(

        (success) => {

          if (success) {
           this.loginSuccess = true;  
            this.router.navigate(['dashboard']).then(() => {
              const encrypted_password = this.auth.encryptAES(password);
              sessionStorage.setItem('secure_pwd', encrypted_password);

              this.showSuccessToaster();
            });
          } else {
            this.error = 'Invalid credentials';
          }
        },
        (error) => {
          console.error('Login error:', error);
          this.toaster.show('error', error.error.message, error.statusText, 5000);

          this.error = 'Login failed. Please try again.';
          // this.showErrorToaster();
        }
      );
    } catch (error) {
      console.error('Encryption error:', error);
      this.error = 'Encryption error occurred';
      this.showErrorToaster();
    }
  }

    onForgotEmailSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const { email } = this.forgotPasswordForm.value;

    console.log('Forgont password email: ', email)
    // Call an API to send the email to the user or to handle the forgot email functionality
    this.auth.forgotEmail(email).subscribe(
      (success) => {

        console.log('success: ', success)
        if(success) {
          this.toaster.show('success', 'Email sent!', 'Please check your inbox for further instructions.');
          this.isForgotEmail = false;
        }else{
            this.toaster.show('error', 'Invalid Email!', 'Please enter valid registerd email id');
        }
   
      },
      (error) => {
        console.error('Forgot email error:', error);
        this.toaster.show('error', error.error.message, error.statusText, 5000);
      }
    );
  }

    toggleForgotEmail(): void {
    this.isForgotEmail = !this.isForgotEmail;
  }

  showSuccessToaster() {
     if (this.loginSuccess) {
      this.toaster.show('success', 'Login Successful', 'You have successfully logged in!');
      this.loginSuccess = false;  
    }
  }

  showErrorToaster() {
    this.toaster.show('error', 'Invalid credential', 'Invalid userId or Password', 50000);
    this.loginSuccess = false;
  }
}