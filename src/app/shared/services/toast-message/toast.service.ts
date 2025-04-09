import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  positiveMessage = signal('');
  negativeMessage = signal('');

  constructor() { }

  /**
   * Sets a positive toast message and automatically clears it after 3 seconds.
   * @param message - The positive message to be displayed.
   */
  setPositiveMessage(message: string) {
    this.positiveMessage.set(message);
    setTimeout(() => {
      this.clearToastMessage();
    }, 3000);
  }

  /**
   * Sets a negative toast message and automatically clears it after 3 seconds.
   * @param message - The negative message to be displayed.
   */
  setNegativeMessage(message: string) {
    this.negativeMessage.set(message);
    setTimeout(() => {
      this.clearToastMessage();
    }, 3000);
  }

  /**
   * Clears the toast message after a certain amount of time.
   */
  clearToastMessage() {
    this.positiveMessage.set('');
    this.negativeMessage.set('');
  }
}
