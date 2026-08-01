import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-secondary-100">
      <div class="w-full max-w-md bg-secondary-100 rounded-md  p-8 m-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-secondary-900">Create Account</h1>
          <p class="text-secondary-500 mt-2">Start managing your tasks</p>
        </div>

        @if (error()) {
          <div class="bg-error-bg text-error px-4 py-3 rounded-md mb-4 text-sm">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Name</label>
            <input type="text" [(ngModel)]="name" name="name" required
              class="w-full px-4 py-2.5 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="John Doe">
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full px-4 py-2.5 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="you@example.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="6"
              class="w-full px-4 py-2.5 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="Min. 6 characters">
          </div>
          <button type="submit" [disabled]="loading()"
            class="w-full bg-primary-600 hover:bg-primary-700 text-ink font-medium py-2.5 rounded-md transition-colors disabled:opacity-50">
            @if (loading()) { Creating account... } @else { Create Account }
          </button>
        </form>

        <p class="text-center mt-6 text-secondary-500 text-sm">
          Already have an account?
          <a routerLink="/login" class="text-primary-600 hover:text-primary-700 font-medium">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async onSubmit(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.register(this.email, this.name, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error.set(e.error?.message || 'Registration failed');
    } finally {
      this.loading.set(false);
    }
  }
}
