import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../shared/services/navigation-service/navigation.service';
import { AuthService } from '../../shared/services/auth-service/auth.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { RegisterInterface } from '../../shared/interfaces/register-interface';

@Component({
  selector: 'app-register-content',
  imports: [CommonModule, MatIcon, ReactiveFormsModule],
  templateUrl: './register-content.component.html',
  styleUrl: './register-content.component.scss'
})
export class RegisterContentComponent implements OnInit {
  authService = inject(AuthService);
  navigator = inject(NavigationService);
  showPassword: boolean = false;
  showRepeatedPassword: boolean = false;
  registerForm: FormGroup = new FormGroup({});

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Resets the successful state of the AuthService to false, indicating that the registration process
   * has not been completed successfully.
   */
  ngOnInit(){
    this.authService.successful.set(false);
  }

  /**
   * Initializes the component.
   *
   * The constructor creates a new FormGroup called `registerForm` and assigns it to the component's
   * `registerForm` property. The FormGroup is created with the following properties:
   * - `email`: A FormControl with the value of the AuthService's `landingEmail` property,
   *            which is set to the email address that the user entered on the landing page.
   *            The FormControl is required and must match the pattern of a valid email address.
   * - `password`: A FormControl with a blank value, which is required and must match the pattern
   *              of a valid password (at least 8 characters, 1 uppercase and 1 number).
   * - `repeated_password`: A FormControl with a blank value, which is required.
   *
   * The FormGroup is also assigned the `passwordMatchValidator` as a validator, which checks that
   * the values of `password` and `repeated_password` are the same. If they are not, the validator
   * returns an object with a `passwordMismatch` property set to `true`.
   */
  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group(
      {
        email: [this.authService.landingEmail(), [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
        password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
        repeated_password: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  /**
   * Registers a user using the values from the register form.
   * If the register form is valid, this method sets the `registerData` property of the AuthService
   * to the values of the register form and calls the AuthService's `register` method.
   */
  register() {
    if (this.registerForm.valid) {
      this.authService.registerData.set(this.registerForm.value as RegisterInterface);
      this.authService.register();
    }
  }

  /**
   * Returns a validator function that checks if the values of `password` and `repeated_password` are the same.
   * If they are not, the validator returns an object with a `passwordMismatch` property set to `true`.
   * @returns A validator function that can be used to validate a form group.
   */
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const repeatedPassword = control.get('repeated_password')?.value;
      return password === repeatedPassword ? null : { passwordMismatch: true };
    };
  }

  /**
   * Returns the form control associated with the email input field.
   * This control can be used to access or manipulate the value and
   * validation state of the email field within the form.
   */
  get emailControl() {
    return this.registerForm.get('email') as FormControl;
  }

  /**
   * Returns the form control associated with the password input field.
   * This control can be used to access or manipulate the value and
   * validation state of the password field within the form.
   */
  get passwordControl() {
    return this.registerForm.get('password') as FormControl;
  }



}
