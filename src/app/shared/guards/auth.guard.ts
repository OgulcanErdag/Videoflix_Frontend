import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavigationService } from '../services/navigation-service/navigation.service';


/**
 * Guard that checks if the user is authenticated before allowing them to
 * access a route. If the user is not authenticated, it redirects them to the login page.
 * @param route The route that the user is trying to access.
 * @param state The state of the router.
 * @returns true if the user is authenticated, false otherwise.
 */
export const authGuard: CanActivateFn = (route, state) => {
  let navigator = inject(NavigationService);
  let token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {navigator.navigateTo('/login'); return false;}
  return true;
};
