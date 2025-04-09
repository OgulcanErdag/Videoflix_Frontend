import { effect, inject, Injectable, signal } from '@angular/core';
import { LoginInterface } from '../../interfaces/login-interface';
import { RegisterInterface } from '../../interfaces/register-interface';
import { NavigationService } from '../navigation-service/navigation.service';
import { ToastService } from '../toast-message/toast.service';
import { HttpsService } from '../https-service/https.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL = 'http://127.0.0.1:8000/videoflix/api';
  navigator = inject(NavigationService)
  toastService = inject(ToastService)
  httpsService = inject(HttpsService)
  resetToken = signal('')
  landingEmail = signal('');
  forgotEmail = signal('');
  rememberMe = signal(false);
  successful = signal(false);
  sending = signal<boolean>(false)
  loginData = signal<LoginInterface>({
    email: '',
    password: ''
  });
  registerData = signal<RegisterInterface>({
    email: '',
    password: '',
    repeated_password: ''
  });
  resetData = signal({})

  /**
   * Performs a login request.
   * Sets the sending signal to true before making a POST request to the /login/ endpoint.
   * The request body consists of the login data (email and password).
   * If the request is successful, the successfulLogin method is called with the response.
   * Otherwise, the setErrorLogin method is called with the error.
   */
  login() {
    this.sending.set(true);
    this.httpsService.post<{ token: string; message: string }>(`${this.BASE_URL}/login/`, this.loginData())
      .subscribe({
        next: (response) => { this.successfulLogin(response); },
        error: (error) => { this.setErrorLogin(error); }
      });
  }

  successfulLogin(response: any) {
    if (response.token) {
      this.settokentostorage(response);
      this.sending.set(false);
      this.navigator.navigateTo('/videos');
    }
  }

  /**
   * Handles the error response for a login attempt.
   * Retrieves the error message from the error object or provides a default message.
   * Sets a negative toast message with the error message and updates the sending signal to false.
   * @param error - The error object returned from the login request.
   */
  setErrorLogin(error: any) {
    const errorMessage = error.error.message || 'Login failed. Please try again.';
    this.toastService.setNegativeMessage(errorMessage);
    this.sending.set(false);
  }

  /**
   * Stores the authentication token in the appropriate storage based on the
   * rememberMe flag. If rememberMe is true, the token is stored in localStorage;
   * otherwise, it is stored in sessionStorage.
   * @param response - The response object containing the authentication token.
   */
  settokentostorage(response: any) {
    if (this.rememberMe()) {
      localStorage.setItem('token', response.token);
    } else {
      sessionStorage.setItem('token', response.token);
    }
  }

  /**
   * Checks if there is a token stored in localStorage and attempts to
   * automatically log the user in using the remember-login endpoint.
   * If the token is invalid, it will be removed from storage and the
   * user will be left in the login page.
   */
  rememberedLogin() {
    let remembertoken = localStorage.getItem('token');
    if (remembertoken) {
      this.sending.set(true);
      this.httpsService.post<{ token: string; message: string }>(`${this.BASE_URL}/remember-login/`, { token: remembertoken })
        .subscribe({
          next: (response) => { this.succesfullRememberLogin(response); },
          error: (error) => { this.setErrorLogin(error) }
        })
    }
  }

  /**
   * Handles the successful response from the remember-login endpoint.
   * If the response contains a valid token, the user is redirected to the videos page,
   * a positive toast message is set and the sending signal is set to false.
   * @param response - The response object containing the authentication token.
   */
  succesfullRememberLogin(response: any) {
    if (response.token) {
      this.navigator.navigateTo('/videos');
      this.sending.set(false);
    }
  }

  /**
   * Simulates a login for the guest user. This is useful for testing
   * and demonstration purposes.
   */
  guestLogin() {
    this.loginData.set({
      email: 'guest@example.com',
      password: 'Guest1234!'
    })
    this.login();
  }

  /**
   * Registers a new user using the values in the registerData observable.
   * The request body consists of the register data (email, password and repeated_password).
   * If the request is successful, the successfulRegister method is called with the response.
   * Otherwise, the setErrorRegister method is called with the error.
   */
  register() {
    this.sending.set(true);
    this.httpsService.post<{ message: string }>(`${this.BASE_URL}/register/`, this.registerData())
      .subscribe({
        next: (response) => { this.setSuccessfullRegisterMessage(response); },
        error: (error) => { this.setErrorRegisterMessage(error); }
      })
  }

  /**
   * Handles the successful response from the register endpoint.
   * If the response contains a message, a positive toast message is set with the message,
   * the successful state of the AuthService is set to true, and the sending signal is set to false.
   * @param response - The response object containing the success message.
   */
  setSuccessfullRegisterMessage(response: any) {
    this.toastService.setPositiveMessage(response.message);
    this.successful.set(true);
    this.sending.set(false);
  }

  /**
   * Handles the error response for a registration attempt.
   * Retrieves the error message from the error object or provides a default message.
   * Sets a negative toast message with the error message and updates the sending signal to false.
   * @param error - The error object returned from the registration request.
   */
  setErrorRegisterMessage(error: any) {
    const errorMessage = error.error.message || 'Registration failed. Please try again.';
    this.toastService.setNegativeMessage(errorMessage);
    this.sending.set(false);
  }

  /**
   * Sends a POST request to the /reset-password/ endpoint with the user's email.
   * Sets the sending signal to true before making the request.
   * If the request is successful, calls setSuccessResetPasswordMessage.
   * If the request fails, calls setErrorResetPasswordMessage.
   */
  sendResetPasswordEmail() {
    this.sending.set(true);
    this.httpsService.post<{ message: string }>(`${this.BASE_URL}/reset-password/`, { email: this.forgotEmail() })
      .subscribe({
        next: () => { this.setSuccessResetPasswordMessage(); },
        error: () => { this.setErrorResetPasswordMessage(); }
      });
  }

  /**
   * Sets the state of the AuthService to reflect a successful reset password email
   * request. Sets the sending signal to false, the successful signal to true, and
   * resets the forgotEmail observable to an empty string.
   */
  setSuccessResetPasswordMessage() {
    this.sending.set(false);
    this.successful.set(true);
    this.forgotEmail.set('');
  }

  /**
   * Sets the state of the AuthService to reflect a failed reset password email request.
   * Sets the successful signal to true, clears the forgotEmail observable, and sets
   * the sending signal to false.
   */
  setErrorResetPasswordMessage() {
    this.successful.set(true);
    this.forgotEmail.set('');
    this.sending.set(false);
  }

  /**
   * Sends a POST request to the /reset-password/confirm/<token>/ endpoint with the
   * values from the resetData observable. Sets the sending signal to true before
   * making the request. If the request is successful, calls setSuccessfullResetedMessage.
   * If the request fails, calls setErrorResetedPassword.
   */
  resetPassword() {
    this.sending.set(true);
    this.httpsService.post<{ message: string }>(`${this.BASE_URL}/reset-password/confirm/${this.resetToken()}/`, this.resetData())
      .subscribe({
        next: (response) => { this.setSucessfulResetedMessage(response); },
        error: (error) => { this.setErrorResetedPassword(error); }
      })
  }

  /**
   * Handles the successful response for a password reset request.
   * Sets a positive toast message with the response message, updates the successful
   * state to true, clears the reset token and reset data, and sets the sending signal to false.
   * @param response - The response object containing the success message.
   */
  setSucessfulResetedMessage(response: any) {
    this.toastService.setPositiveMessage(response.message);
    this.successful.set(true);
    this.resetToken.set('');
    this.resetData.set({});
    this.sending.set(false);
  }

  /**
   * Handles the error response from the password reset endpoint.
   * Retrieves the error message from the error object or provides a default message.
   * Sets a negative toast message with the error message and updates the sending signal to false.
   * @param error - The error object returned from the password reset request.
   */
  setErrorResetedPassword(error: any) {
    const errorMessage = error.error.error || 'Password reset email failed. Please try again.';
    this.toastService.setNegativeMessage(errorMessage);
    this.sending.set(false);
  }

  /**
   * Removes the authentication token from both localStorage and sessionStorage,
   * and navigates the user back to the login page.
   */
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.navigator.navigateTo('/login');
  }
}
