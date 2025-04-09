import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../shared/components/header/header.component";
import { ImprintContentComponent } from "./imprint-content/imprint-content.component";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { BackgroundImageService } from '../shared/services/bg-image-service/background-image.service';

@Component({
  selector: 'app-imprint-page',
  imports: [HeaderComponent, ImprintContentComponent, FooterComponent, CommonModule],
  templateUrl: './imprint-page.component.html',
  styleUrl: './imprint-page.component.scss'
})
export class ImprintPageComponent {
  backgroundService = inject(BackgroundImageService);
}
