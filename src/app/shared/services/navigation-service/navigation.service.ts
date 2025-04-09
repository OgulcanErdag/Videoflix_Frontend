import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private location: Location) {}

  /**
   * Navigate to the given route path, and optionally supply query parameters.
   * @param path The route path to navigate to.
   * @param queryParams An object of query parameters to supply in the route.
   */
  navigateTo(path: string, queryParams?: Record<string, any>) {
    this.router.navigate([path], { queryParams });
  }

  /**
   * Navigates to the previous page in the browser's history.
   */
  goBack() {
    this.location.back();
  }
}

