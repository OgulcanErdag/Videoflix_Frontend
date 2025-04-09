import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationService } from '../../shared/services/navigation-service/navigation.service';
import { AuthService } from '../../shared/services/auth-service/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResetPassword } from '../../shared/interfaces/reset-password';

@Component({
  selector: 'app-reset-page-content',
  imports: [CommonModule, MatIcon, ReactiveFormsModule],
  templateUrl: './reset-page-content.component.html',
  styleUrl: './reset-page-content.component.scss'
})
export class ResetPageContentComponent implements OnInit {
  authService = inject(AuthService);
  navigator = inject(NavigationService);
  showPassword: boolean = false;
  showRepeatedPassword: boolean = false;
  route = inject(ActivatedRoute);
  resetPasswordForm: FormGroup = new FormGroup({});
  token = this.route.snapshot.paramMap.get('token')!

  /**
   * Constructs a new instance of the ResetPageContentComponent.
   * Creates a form group with two controls: password and repeated_password.
   * The password control is required and must match a pattern of at least 8 characters, 1 uppercase, 1 number, and 1 special character.
   * The repeated_password control is required and must match the value of the password control.
   */
  constructor(private formBuilder: FormBuilder) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
        repeated_password: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  /**
   * Returns a validator function that checks if the values of the password and
   * repeated_password controls are equal. If the values are not equal, returns
   * an object with a single property 'passwordMismatch' set to true. If the
   * values are equal, returns null.
   * @returns A validator function that takes an AbstractControl as an argument
   * and returns a ValidationErrors object or null.
   */
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const repeatedPassword = control.get('repeated_password')?.value;
      return password === repeatedPassword ? null : { passwordMismatch: true };
    };
  }

  /**
   * Returns the form control associated with the password input field.
   * This control can be used to access or manipulate the value and
   * validation state of the password field within the form.
   * @returns A FormControl object associated with the password input field.
   */
  get passwordControl() {
    return this.resetPasswordForm.get('password') as FormControl;
  }

  /**
   * Resets the user's password with the values from the reset password form.
   * If the form is valid, sets the AuthService's resetData observable with the
   * values from the form and calls the AuthService's resetPassword method.
   */
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetData.set(this.resetPasswordForm.value as ResetPassword);
      this.authService.resetToken.set(this.token);
      this.authService.resetPassword();
    }
  }

  /**
   * Called when the component is initialized.
   * Sets the AuthService's successful observable to false, indicating that the
   * user has not successfully completed the reset password process.
   */
  ngOnInit() {
    this.authService.successful.set(false);
   }
}
