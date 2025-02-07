import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Routing
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig, // Spread the existing appConfig
  providers: [
    ...(appConfig.providers || []), // Ensure existing providers are retained
    provideRouter(routes), // Add the Router provider
    provideHttpClient(), // Add the HttpClient provider
  ],
}).catch((err) => {
  console.error('Error bootstrapping application:', err);
});
