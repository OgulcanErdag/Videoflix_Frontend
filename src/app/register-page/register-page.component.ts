import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/components/header/header.component";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { BackgroundImageService } from '../shared/services/bg-image-service/background-image.service';
import { CommonModule } from '@angular/common';
import { RegisterContentComponent } from "./register-content/register-content.component";

@Component({
  selector: 'app-register-page',
  imports: [HeaderComponent, FooterComponent, CommonModule, RegisterContentComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  animationClass = 'fade-in';
  
  constructor(public backgroundService: BackgroundImageService) {}
}
