import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptorsFromDi()),
  { provide: AuthInterceptor, useClass: AuthInterceptor, multi: true }, provideToastr(), provideAnimations(), provideLottieOptions({
    player: () => import('lottie-web')
  })]
};
