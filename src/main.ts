import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig, // Spread the existing appConfig
  providers: [
    ...(appConfig.providers || []), // Ensure existing providers are retained
    provideHttpClient(), // Add the HttpClient provider
  ],
}).catch((err) => console.error(err));
