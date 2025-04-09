import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { NavigationService } from '../../services/navigation-service/navigation.service';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  actualRoute: string;
  navigator = inject(NavigationService);
  authService = inject(AuthService);
  isWideScreen = window.innerWidth > 750;

  /**
   * Initializes the component with the current route URL.
   * @param router The router used to get the current URL.
   */
  constructor(private router: Router){
    this.actualRoute = this.router.url;
    window.addEventListener('resize', () => {
      this.isWideScreen = window.innerWidth > 750;
    })
  }

}
