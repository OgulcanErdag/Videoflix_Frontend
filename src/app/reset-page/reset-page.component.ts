import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BackgroundImageService } from '../shared/services/bg-image-service/background-image.service';
import { HeaderComponent } from "../shared/components/header/header.component";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { ResetPageContentComponent } from "./reset-page-content/reset-page-content.component";

@Component({
  selector: 'app-reset-page',
  imports: [CommonModule, HeaderComponent, FooterComponent, ResetPageContentComponent],
  templateUrl: './reset-page.component.html',
  styleUrl: './reset-page.component.scss'
})
export class ResetPageComponent {
  animationClass = 'fade-in';

  constructor(public backgroundService: BackgroundImageService) { }
}
