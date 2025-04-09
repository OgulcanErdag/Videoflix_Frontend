import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth-service/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginInterface } from '../../shared/interfaces/login-interface';
import { NavigationService } from '../../shared/services/navigation-service/navigation.service';

@Component({
  selector: 'app-login-content',
  imports: [MatIcon, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login-content.component.html',
  styleUrl: './login-content.component.scss'
})
export class LoginContentComponent {
  authService = inject(AuthService);
  navigator = inject(NavigationService);
  showPassword: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  rememberMe: boolean = false
  token = localStorage.getItem('token');

  /**
   * Constructs a new instance of the LoginContentComponent.
   */
  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
  }

  /**
   * Handles the login process by checking the validity of the login form and
   * triggering the AuthService's login method.
   *
   * If the user has a valid token, the AuthService's rememberedLogin method is
   * called instead.
   */
  login() {
    if (this.token) {
        this.authService.rememberedLogin()
    } else {
      if (this.loginForm.valid) {
        this.authService.loginData.set(this.loginForm.value as LoginInterface);
        this.authService.login();
      }
    }
  }

  /**
   * Returns the form control associated with the email input field.
   * This control can be used to access or manipulate the value and
   * validation state of the email field within the form.
   */
  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  /**
   * Returns the form control associated with the password input field.
   * This control can be used to access or manipulate the value and
   * validation state of the password field within the form.
   */
  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }

  /**
   * Toggles the rememberMe flag and updates the AuthService's rememberMe
   * observable accordingly.
   */
  setRememberMe() {
    this.rememberMe = !this.rememberMe;
    this.authService.rememberMe.set(this.rememberMe);
  }
}
