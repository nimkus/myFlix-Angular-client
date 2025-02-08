import { Component, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // Needed to handle errors gracefully

import { MovieModalComponent } from '../movie-modal/movie-modal.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  private fetchApiData = inject(FetchApiDataService);
  private moviesSignal = signal<any[]>([]); // Signal for movies
  private favoriteMoviesSignal = signal<string[]>([]); // Signal for user's favorite movie IDs

  // Input to determine if movie card is rendered on profile view
  @Input() isProfileView: boolean | undefined;

  // Computed property for movies list
  moviesList = computed(() =>
    this.moviesSignal().map(
      (movie: {
        _id: string;
        title: string;
        imagePath: string;
        genre?: { name: string }[];
        director?: { name: string }[];
      }) => ({
        ...movie, // ✅ Keep all original movie properties (including `_id`)
        genreNames:
          movie.genre && movie.genre.length > 0
            ? movie.genre.map((g: { name: string }) => g.name).join(', ')
            : 'No genre available',

        directorNames:
          movie.director && movie.director.length > 0
            ? movie.director.map((d: { name: string }) => d.name).join(', ')
            : 'No director available',
      })
    )
  );

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Reuasable function to show snackbar messages
   */
  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  /**
   * Fetch all movies with error handling
   */
  getMovies(): void {
    this.fetchApiData
      .getAllMovies()
      .pipe(
        catchError((error) => {
          console.error('Error fetching movies:', error);
          alert('Failed to load movies. Please try again later.');
          return of([]); // Return empty array on failure
        })
      )
      .subscribe((res: any) => {
        this.moviesSignal.set(res.data || []);
      });
  }

  /**
   * Fetch user's favorite movies with error handling
   */
  getFavoriteMovies(): void {
    const username = localStorage.getItem('username');
    if (!username) {
      console.warn('No username found in local storage.');
      return;
    }

    this.fetchApiData
      .getUserInfo(username)
      .pipe(
        catchError((error) => {
          console.error('Error fetching favorite movies:', error);
          alert('Failed to load favorite movies. Please try again later.');
          return of([]); // Return empty array on failure
        })
      )
      .subscribe((res: any) => {
        if (res && Array.isArray(res.favMovies)) {
          this.favoriteMoviesSignal.set(res.favMovies);
        } else {
          console.warn('Unexpected response structure:', res);
          alert('Unexpected response from server while fetching favorites.');
        }
      });
  }

  /**
   * Check if a movie is a favorite
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMoviesSignal().includes(movieId);
  }

  /**
   * Filter movies based on `isProfileView`
   */
  favMoviesList = computed(
    () =>
      this.isProfileView
        ? this.moviesSignal().filter((movie) => this.isFavorite(movie._id)) // ✅ Only favorites
        : this.moviesSignal() // ✅ Show all movies in other views
  );

  /**
   * Toggle favorite movie with error handling
   */
  toggleFavorite(movieId: string): void {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('User is not logged in.');
      return;
    }

    if (this.isFavorite(movieId)) {
      // Remove from favorites
      this.fetchApiData
        .removeFavoriteMovie(username, movieId)
        .pipe(
          catchError((error) => {
            console.error('Error removing favorite movie:', error);
            alert('Failed to remove movie from favorites.');
            return of(null); // Ensures subscription does not break
          })
        )
        .subscribe((resp: any) => {
          if (!resp || !resp._id) {
            console.warn('Unexpected API response while removing:', resp);
            alert('Something went wrong while removing the movie.');
            return;
          }

          this.showSnackbar('Movie removed from favorites.');
          this.favoriteMoviesSignal.set(
            this.favoriteMoviesSignal().filter((id) => id !== movieId)
          );
        });
    } else {
      // Add to favorites
      this.fetchApiData
        .addFavoriteMovie(username, movieId)
        .pipe(
          catchError((error) => {
            console.error('Error adding favorite movie:', error);
            alert('Failed to add movie to favorites.');
            return of(null);
          })
        )
        .subscribe((resp: string | null) => {
          console.log('Add favorite response:', resp);
          if (resp === 'User has been updated.') {
            this.showSnackbar('Movie added to favorites.');
            this.favoriteMoviesSignal.set([
              ...this.favoriteMoviesSignal(),
              movieId,
            ]);
          } else {
            console.warn('Unexpected API response while adding:', resp);
            alert('Something went wrong while adding the movie.');
          }
        });
    }
  }

  /**
   * Open Director modal
   */
  openDirectorModal(directors: any[]): void {
    if (!directors || directors.length === 0) {
      this.showSnackbar('No director information available.');
      return;
    }

    this.dialog.open(MovieModalComponent, {
      data: {
        type: 'Director',
        details: directors, // Pass full director object(s)
      },
    });
  }

  /**
   * Open Genre modal
   */
  openGenreModal(genres: any[]): void {
    if (!genres || genres.length === 0) {
      this.showSnackbar('No genre information available.');
      return;
    }

    this.dialog.open(MovieModalComponent, {
      data: {
        type: 'Genre',
        details: genres, // Pass full genre object(s)
      },
    });
  }
}
