import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    AuthService.hasToken()
  ); // Fix here

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private static hasToken(): boolean {
    return (
      !!localStorage.getItem('token') && !!localStorage.getItem('username')
    );
  }

  login(username: string, token: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true); // Notify subscribers
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedInSubject.next(false); // Notify subscribers
  }
}
