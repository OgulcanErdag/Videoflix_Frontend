import { Component, inject } from '@angular/core';
import { PrivacyContentComponent } from "./privacy-content/privacy-content.component";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { HeaderComponent } from "../shared/components/header/header.component";
import { BackgroundImageService } from '../shared/services/bg-image-service/background-image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-page',
  imports: [PrivacyContentComponent, FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './privacy-page.component.html',
  styleUrl: './privacy-page.component.scss'
})
export class PrivacyPageComponent {
  backgroundService = inject(BackgroundImageService);
}
