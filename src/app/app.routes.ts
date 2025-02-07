import { Routes } from '@angular/router';

// Import the components to be used in the routes
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';

// Define the routes
export const routes: Routes = [
  { path: 'welcome', component: WelcomeScreenComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'profile', component: ProfileViewComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
];
