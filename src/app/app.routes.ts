import { Routes } from '@angular/router';

// Import the components to be used in the routes
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';

// Check login status
const isLoggedIn = () => {
  return localStorage.getItem('username') && localStorage.getItem('token');
};

// Define the routes
export const routes: Routes = [
  {
    path: '',
    redirectTo: isLoggedIn() ? '/movies' : '/welcome',
    pathMatch: 'full',
  },
  { path: 'welcome', component: WelcomeScreenComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'profile', component: ProfileViewComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
];
