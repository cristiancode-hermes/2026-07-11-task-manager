import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-secondary-100">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 m-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-secondary-900">Task Manager</h1>
          <p class="text-secondary-500 mt-2">Sign in to your account</p>
        </div>

        @if (error()) {
          <div class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full px-4 py-2.5 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="you@example.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full px-4 py-2.5 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="••••••••">
          </div>
          <button type="submit" [disabled]="loading()"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
            @if (loading()) { Signing in... } @else { Sign In }
          </button>
        </form>

        <p class="text-center mt-6 text-secondary-500 text-sm">
          Don't have an account?
          <a routerLink="/register" class="text-primary-600 hover:text-primary-700 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async onSubmit(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error.set(e.error?.message || 'Invalid credentials');
    } finally {
      this.loading.set(false);
    }
  }
}
