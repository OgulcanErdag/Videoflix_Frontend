import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BackgroundImageService } from '../shared/services/bg-image-service/background-image.service';
import { HeaderComponent } from "../shared/components/header/header.component";
import { LoginContentComponent } from "./login-content/login-content.component";
import { FooterComponent } from "../shared/components/footer/footer.component";

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, HeaderComponent, LoginContentComponent, FooterComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  animationClass = 'fade-in';

  constructor(public backgroundService: BackgroundImageService) {}
}
