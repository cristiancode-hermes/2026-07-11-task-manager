import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal(false);

  constructor() {
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.setToken(token);
      this.getProfile().catch(() => this.logout());
    }
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async register(email: string, name: string, password: string): Promise<AuthResponse> {
    const res = await lastValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/register`, { email, name, password })
    );
    this.setToken(res.token);
    this.currentUser.set(res.user);
    return res;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await lastValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
    );
    this.setToken(res.token);
    this.currentUser.set(res.user);
    return res;
  }

  async getProfile(): Promise<User> {
    const user = await lastValueFrom(
      this.http.get<User>(`${this.baseUrl}/profile`)
    );
    this.currentUser.set(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
