import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  // signal to track auth state
  isAuthenticated = signal(this.hasToken());

  login() {
    localStorage.setItem(this.tokenKey, 'mock-token');
    this.isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  
}
