import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define API URL
const apiUrl = 'https://nimkus-movies-flix-6973780b155e.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /** ******************************
   * MOVIE ENDPOINTS
   ****************************** **/

  // Get all movies (requires authentication)
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get a single movie by title (requires authentication)
  public getMovie(title: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${title}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get all genres (requires authentication)
  public getAllGenres(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/genres/all', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get movies by genre name (requires authentication)
  public getMoviesByGenre(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/genres/${name}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get all directors (requires authentication)
  public getAllDirectors(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/directors/all', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get a director by name (requires authentication)
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/directors/${name}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get all actors (requires authentication)
  public getAllActors(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/actors/all', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get an actor by name (requires authentication)
  public getActor(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/actors/${name}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** ******************************
   * USER ENDPOINTS
   ****************************** **/

  // Get all users (requires authentication)
  public getAllUsers(): Observable<any> {
    return this.http
      .get(apiUrl + 'users', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Create a user (Register)
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Update user details (requires authentication)
  public updateUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(`${apiUrl}users/${username}`, userDetails, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Delete a user (requires authentication)
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${username}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Add movie to favorites (requires authentication)
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .put(
        `${apiUrl}users/${username}/${movieId}`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  // Remove movie from favorites (requires authentication)
  public removeFavoriteMovie(
    username: string,
    movieId: string
  ): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${username}/${movieId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /** ******************************
   * HELPER FUNCTIONS
   ****************************** **/

  // Helper function to get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Extract Response Data (Helper Function)
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Handle errors properly
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was:`,
        error.error
      );
    }
    return throwError('Something went wrong; please try again later.');
  }
}
