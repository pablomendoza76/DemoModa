import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // 👈 IMPORTANTE

import { routes } from './app.routes';
import { FormsModule } from '@angular/forms'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // 👈 NECESARIO PARA USAR HttpClient
    provideClientHydration(withEventReplay())
  ]
};
