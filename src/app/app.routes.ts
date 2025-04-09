import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ForgotPageComponent } from './forgot-page/forgot-page.component';
import { ResetPageComponent } from './reset-page/reset-page.component';
import { ActivateAccountPageComponent } from './activate-account-page/activate-account-page.component';
import { VideosPageComponent } from './videos-page/videos-page.component';
import { authGuard } from './shared/guards/auth.guard';
import { ImprintPageComponent } from './imprint-page/imprint-page.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'legal-notice', component: ImprintPageComponent },
  { path: 'privacy-policy', component: PrivacyPageComponent },
  { path: 'forgot-password', component: ForgotPageComponent },
  { path: 'reset-password/confirm/:token', component: ResetPageComponent },
  { path: 'activate-account/:uid/:token', component: ActivateAccountPageComponent },
  { path: 'videos', component: VideosPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
