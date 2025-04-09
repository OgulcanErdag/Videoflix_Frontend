import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth-service/auth.service';
import { NavigationService } from '../../shared/services/navigation-service/navigation.service';

@Component({
  selector: 'app-forgot-content',
  imports: [CommonModule, MatIcon, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-content.component.html',
  styleUrl: './forgot-content.component.scss'
})
export class ForgotContentComponent implements OnInit {
  authService = inject(AuthService);
  navigator = inject(NavigationService);

  emailForm = new FormGroup({
    email: new FormControl(this.authService.forgotEmail(), [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)])
  });

  /**
   * Retrieves the form control for the email field from the email form group.
   */
  get emailControl() {
    return this.emailForm.get('email') as FormControl;
  }

  /**
   * Updates the email value in the AuthService's forgotEmail observable with the current value from the email form control. If the email
   * form control is empty or undefined, sets an empty string.
   */
  updateForgotEmail() {
    this.authService.forgotEmail.set(this.emailForm.get('email')?.value || '');
  }

  /**
   * Called when the component is initialized.
   * Sets the AuthService's successful observable to false, indicating that the user has not successfully
   * completed the forgot password process.
   */
  ngOnInit() {
    this.authService.successful.set(false);
  }
}
