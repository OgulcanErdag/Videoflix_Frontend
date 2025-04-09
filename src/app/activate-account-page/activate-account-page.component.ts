import { Component } from '@angular/core';
import { ActivateContentComponent } from "./activate-content/activate-content.component";
import { HeaderComponent } from "../shared/components/header/header.component";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { BackgroundImageService } from '../shared/services/bg-image-service/background-image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate-account-page',
  imports: [ActivateContentComponent, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './activate-account-page.component.html',
  styleUrl: './activate-account-page.component.scss'
})
export class ActivateAccountPageComponent {
  animationClass = 'fade-in';
  
  constructor(public backgroundService: BackgroundImageService) { }
}
