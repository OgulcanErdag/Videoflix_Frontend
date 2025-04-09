import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../shared/components/header/header.component";
import { ForgotContentComponent } from "./forgot-content/forgot-content.component";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { BackgroundImageService } from '../shared/services/bg-image-service/background-image.service';

@Component({
  selector: 'app-forgot-page',
  imports: [HeaderComponent, ForgotContentComponent, FooterComponent, CommonModule],
  templateUrl: './forgot-page.component.html',
  styleUrl: './forgot-page.component.scss'
})
export class ForgotPageComponent {
  animationClass = 'fade-in';
  
  /**
   * @constructor
   * @param backgroundService service for background images
   */
  constructor(
    public backgroundService: BackgroundImageService,
  ) {}
}
