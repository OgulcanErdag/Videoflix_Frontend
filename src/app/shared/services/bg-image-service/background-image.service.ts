import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService {
  images = signal<string[]>(this.generateImagePaths(10, 'shared/images/background', '-min.webp'));
  currentBackground = signal<string>(this.images()[0]);
  animationClass = signal<string>('fade-in'); 
  lastIndex = 0;

  /**
   * When the service is created, it will automatically start updating the
   * current background image every 10 seconds.
   */
  constructor() {
    this.updateBackgroundRandomly();
  }

  /**
   * Generates an array of image paths based on the specified count, base path, and extension.
   * @param count - The number of image paths to generate.
   * @param basePath - The base path for the image files.
   * @param extension - The file extension for the image files.
   * @returns An array of strings representing the generated image paths.
   */
  generateImagePaths(count: number, basePath: string, extension: string): string[] {
    return Array.from({ length: count }, (_, i) => `${basePath}${i}${extension}`);
  }

  /**
   * Periodically updates the current background image to a randomly selected one.
   * Ensures that the newly selected image is different from the last displayed image.
   * Resets the animation after each update to trigger a fade-in effect.
   */
  updateBackgroundRandomly(): void {
    setInterval(() => {
      const availableIndexes = this.images()
        .map((_, index) => index)
        .filter((index) => index !== this.lastIndex);
      const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      this.lastIndex = randomIndex;
      this.currentBackground.set(this.images()[randomIndex]);
      this.resetAnimation(); 
    }, 10000);
  }

  /**
   * Resets the animation for the background image to create a fade-in effect when the image changes.
   * To achieve this, the animation class is first set to an empty string, which will remove the
   * animation temporarily. After a short delay of 5 milliseconds, the animation class is set back to
   * 'fade-in', which will trigger the animation to start again.
   */
  resetAnimation(): void {
    this.animationClass.set(''); 
    setTimeout(() => {
      this.animationClass.set('fade-in'); 
    }, 5); 
  }
}

