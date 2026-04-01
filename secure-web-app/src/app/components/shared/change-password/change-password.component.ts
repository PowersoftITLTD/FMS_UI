import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PasswordModule } from 'primeng/password';
import { storedDetails } from '../../../store/auth/auth.selectors';
import { AuthState } from '../../../store/auth/auth.state';
import { map, take } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiService } from '../../../services/api.service';
import { SecureStorageService } from '../../../services/secure/secure-storage.service';
import { ToasterService } from '../../../services/toaster/toaster.service';

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  passwordsMatch: boolean;
  currentPasswordValid: boolean;
}


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    ButtonModule,
    CardModule,
    MessageModule,
    PasswordModule,
    OverlayPanelModule,
    NgClass,
    RouterModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})



export class ChangePasswordComponent {

  authData:any;

  formData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  errors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  validation: PasswordValidation = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
    currentPasswordValid: false
  };

  submitted = false;
  isLoading = false;
  showPassword = false;

  // Mock current password for validation
  private actualCurrentPassword = '';

  constructor(private store: Store, 
              private auth: AuthService,
              private apiService: ApiService,   
              private toaster: ToasterService,
            ) { }

  ngOnInit(): void {
    this.store.select(storedDetails).pipe(take(1)).subscribe((user: AuthState) => {
      const decryptUser: string = user.user

      const encryptedUser = this.auth.decryptAES(decryptUser);   
      
      console.log('encryptedUser: encryptedUser', encryptedUser)

      this.authData = encryptedUser;
      this.actualCurrentPassword = String(sessionStorage.getItem('secure_pwd'));

    })
    this.validateForm();
  }

  onInputChange(): void {
    this.validateForm();
    this.clearErrors();
  }

  validateForm(): void {
    // Validate new password

    this.validation.minLength = this.formData.newPassword.length >= 8;
    this.validation.hasUppercase = /[A-Z]/.test(this.formData.newPassword);
    this.validation.hasLowercase = /[a-z]/.test(this.formData.newPassword);
    this.validation.hasNumber = /[0-9]/.test(this.formData.newPassword);
    this.validation.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.formData.newPassword);
        const d_pwd = this.auth.decryptAES(this.actualCurrentPassword)
      const curr_pwd = this.formData.currentPassword;


    // Check if passwords match
    this.validation.passwordsMatch = this.formData.newPassword === this.formData.confirmPassword &&
      this.formData.newPassword.length > 0;

    // Validate current password (simple validation for demo)
    this.validation.currentPasswordValid = curr_pwd === d_pwd;

  }

  clearErrors(): void {
    this.errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  validateCurrentPassword(): boolean {
    if (!this.formData.currentPassword) {
      this.errors.currentPassword = 'Current password is required';
      return false;
    } 
    return true;
  }

  validateNewPassword(): boolean {
    if (!this.formData.newPassword) {
      this.errors.newPassword = 'New password is required';
      return false;
    }

    const errors = [];
    if (!this.validation.minLength) errors.push('at least 8 characters');
    if (!this.validation.hasUppercase) errors.push('one uppercase letter');
    if (!this.validation.hasLowercase) errors.push('one lowercase letter');
    if (!this.validation.hasNumber) errors.push('one number');
    if (!this.validation.hasSpecialChar) errors.push('one special character');

    if (errors.length > 0) {
      this.errors.newPassword = `Password must contain: ${errors.join(', ')}`;
      return false;
    }

    return true;
  }

  validateConfirmPassword(): boolean {
    if (!this.formData.confirmPassword) {
      this.errors.confirmPassword = 'Please confirm your password';
      return false;
    }
    if (!this.validation.passwordsMatch) {
      this.errors.confirmPassword = 'Passwords do not match';
      return false;
    }
    return true;
  }

  isFormValid(): boolean {
    return this.validation.minLength &&
      this.validation.hasUppercase &&
      this.validation.hasLowercase &&
      this.validation.hasNumber &&
      this.validation.hasSpecialChar &&
      this.validation.passwordsMatch &&
      this.validation.currentPasswordValid
      // this.formData.currentPassword.length >= 6;
  }

  getPasswordStrength(): string {
    const validations = [
      this.validation.minLength,
      this.validation.hasUppercase,
      this.validation.hasLowercase,
      this.validation.hasNumber,
      this.validation.hasSpecialChar
    ];

    const validCount = validations.filter(v => v).length;

    if (validCount === 5) return 'Strong';
    if (validCount >= 3) return 'Medium';
    return 'Weak';
  }

  getPasswordStrengthPercentage(): number {
    const validations = [
      this.validation.minLength,
      this.validation.hasUppercase,
      this.validation.hasLowercase,
      this.validation.hasNumber,
      this.validation.hasSpecialChar,
      this.validation.passwordsMatch,
      this.formData.currentPassword.length >= 6
    ];

    const validCount = validations.filter(v => v).length;
    return Math.round((validCount / validations.length) * 100);
  }


  changePassword() {



    const user = JSON.parse(this.authData)

    console.log('Check form data: ', this.formData)
    const previousePassword = this.formData.currentPassword;
    const newPassword = this.formData.newPassword;

    const decrypted_body:any = {
      UserId:String(user.MKEY),
      Previouse_Password:previousePassword,
      NewPassword:newPassword,
      Session_UserId:null,//String(user.MKEY),
      Business_Groupid:1
    }

    // console.log('decrypted_body: ', decrypted_body);

    const lock = this.auth.encryptAES_JSON(decrypted_body);

    const encrypted_body = {
      changePassword:lock
    }

    this.apiService.postSecureAPI('ChangesPassword_NT', encrypted_body, true).subscribe(
      (res: any) => {
        const isPasswordChange = res?.status === 'Ok' && res?.message === 'User successfully Decrypted logged in Credential';
        // const jwtToken = res?.data?.token;
        const userData = res?.data ? res?.data : null;

        if (isPasswordChange && userData !== null) {
              this.auth.logout();

            this.toaster.show('success', 'Password Changed', 'Your password change successfully.');

          // Handle success logic here
        } else if(res?.status === 'Error', res?.message === 'Incorrect Old Password'){
            this.toaster.show('error', res?.message , 'Incorrect password');
          // Handle failure logic here
        }
      },
      (error) => {
        this.toaster.show('error', error.message, 'Incorrect password');
        console.error('API Error:', error);
        // Handle error logic here
      }
    );

  }

  onSubmit(): void {
    this.submitted = true;

    const isCurrentValid = this.validateCurrentPassword();
    const isNewValid = this.validateNewPassword();
    const isConfirmValid = this.validateConfirmPassword();


    if (isCurrentValid && isNewValid && isConfirmValid) {
      this.isLoading = true;

      this.changePassword();
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
          this.resetForm();
      }, 1500);
    }
  }

  resetForm(): void {
    this.formData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.submitted = false;
    this.validateForm();
  }
}
