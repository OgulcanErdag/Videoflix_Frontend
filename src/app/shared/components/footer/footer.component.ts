import { Component, inject } from '@angular/core';
import { NavigationService } from '../../services/navigation-service/navigation.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InactivityService } from '../../services/inactivity-service/inactivity.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  actualRoute: string;
  navigator = inject(NavigationService);
  inactivityService = inject(InactivityService);

  /**
   * Sets the current route to the router's current URL.
   * @param router The router used to get the current URL.
   */
  constructor(private router: Router) {
    this.actualRoute = this.router.url;
  }
}
