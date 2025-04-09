import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  firstView = true;
  inactivityTimer: any;
  inactivityTimeout = 600000;
  lastResetTime = Date.now();
  remainingTime: number = this.inactivityTimeout / 1000;
  countdownInterval: any;

  /**
   * The constructor of the InactivityService.
   * It first adds "no-scroll" class to the body of the document to prevent the user from scrolling.
   * After 3 seconds, it removes the "no-scroll" class and starts the inactivity timer.
   * The inactivity timer is a function that is called when the user is inactive for a certain period of time.
   * The timer is cleared when the user moves the mouse, presses a key, clicks, starts a touch event or scrolls.
   */
  constructor() {
    document.body.classList.add('no-scroll');
    setTimeout(() => {
      this.firstView = false;
      document.body.classList.remove('no-scroll');
      this.startInactivityTimer();
    }, 3000);
  }

  /**
   * Resets the inactivity timer.
   * It clears the current inactivity timer, sets firstView to false and starts a new inactivity timer.
   * The timer is cleared when the user moves the mouse, presses a key, clicks, starts a touch event or scrolls.
   */
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownInterval);
    this.firstView = false;
    this.lastResetTime = Date.now();
    this.remainingTime = this.inactivityTimeout / 1000;
    this.countdownInterval = setInterval(() => {
      const timeLeft = Math.max(0, Math.ceil((this.inactivityTimeout - (Date.now() - this.lastResetTime)) / 1000));
      this.remainingTime = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
    this.inactivityTimer = setTimeout(() => {
      this.firstView = true;
      clearInterval(this.countdownInterval);
    }, this.inactivityTimeout);
  }
  

  /**
   * Starts the inactivity timer by adding event listeners for various user actions.
   * These events include mouse movements, key presses, clicks, touch starts, and scrolls.
   * Each event triggers a reset of the inactivity timer, ensuring the user is considered active.
   * The function also calls resetInactivityTimer initially to set up the timer.
   */
  startInactivityTimer() {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, () => this.resetInactivityTimer());
    });
    this.resetInactivityTimer();
  }

  /**
   * Updates the inactivity timeout based on user input.
   * This method is called when the user changes the value of the inactivity slider.
   * It parses the new value, converts it to milliseconds, and updates the inactivity timeout.
   * It also resets the inactivity timer to start the countdown from the new value.
   * @param event The event object passed by the input element's change event.
   */
  updateInactivityTimeout(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newTimeout = parseInt(inputElement.value, 10);

    if (!isNaN(newTimeout)) {
      this.inactivityTimeout = newTimeout * 1000;
      this.resetInactivityTimer();
    }
  }

  /**
   * Returns the number of seconds left until the inactivity timeout is reached.
   * @returns The number of seconds left until inactivity timeout.
   */
  getTimeLeft(): number {
    return this.remainingTime;
  }
}
