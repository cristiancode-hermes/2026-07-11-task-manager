import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <div class="min-h-screen bg-secondary-100">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm border-b border-secondary-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <h1 class="text-xl font-bold text-secondary-900">Task Manager</h1>
            <div class="flex items-center gap-4">
              <span class="text-sm text-secondary-500">{{ auth.currentUser()?.name }}</span>
              <button (click)="logout()"
                class="text-sm text-secondary-500 hover:text-red-600 transition-colors">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-bold text-secondary-900">My Tasks</h2>
            <p class="text-secondary-500 mt-1">{{ tasks().length }} task(s)</p>
          </div>
          <button (click)="showCreateForm.set(true)"
            class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
            + New Task
          </button>
        </div>

        <!-- Status Filter -->
        <div class="flex gap-2 mb-6">
          @for (f of filters; track f.value) {
            <button (click)="selectedFilter.set(f.value)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              [class.bg-primary-600]="selectedFilter() === f.value"
              [class.text-white]="selectedFilter() === f.value"
              [class.bg-white]="selectedFilter() !== f.value"
              [class.text-secondary-600]="selectedFilter() !== f.value"
              [class.hover:bg-secondary-50]="selectedFilter() !== f.value"
              [class.border]="selectedFilter() !== f.value"
              [class.border-secondary-300]="selectedFilter() !== f.value">
              {{ f.label }}
            </button>
          }
        </div>

        <!-- Create / Edit Form -->
        @if (showCreateForm() || editingTask()) {
          <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">
              {{ editingTask() ? 'Edit Task' : 'New Task' }}
            </h3>
            <form (ngSubmit)="editingTask() ? updateTask() : createTask()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Title *</label>
                <input type="text" [(ngModel)]="formTitle" name="title" required
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <textarea [(ngModel)]="formDescription" name="description" rows="3"
                  class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-1">Priority</label>
                  <select [(ngModel)]="formPriority" name="priority"
                    class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                  <select [(ngModel)]="formStatus" name="status"
                    class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-1">Due Date</label>
                  <input type="date" [(ngModel)]="formDueDate" name="dueDate"
                    class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                </div>
              </div>
              <div class="flex gap-3 justify-end">
                <button type="button" (click)="cancelForm()"
                  class="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors">Cancel</button>
                <button type="submit" [disabled]="loading()"
                  class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  {{ editingTask() ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        }

        <!-- Loading -->
        @if (loading() && tasks().length === 0) {
          <div class="text-center py-12">
            <div class="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-secondary-500">Loading tasks...</p>
          </div>
        }

        <!-- Error -->
        @if (error()) {
          <div class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
            {{ error() }}
            <button (click)="loadTasks()" class="ml-2 underline">Retry</button>
          </div>
        }

        <!-- Empty State -->
        @if (!loading() && !error() && tasks().length === 0) {
          <div class="text-center py-16 bg-white rounded-xl border border-secondary-200">
            <div class="text-5xl mb-4">📋</div>
            <h3 class="text-lg font-semibold text-secondary-900 mb-2">No tasks yet</h3>
            <p class="text-secondary-500 mb-4">Create your first task to get started</p>
            <button (click)="showCreateForm.set(true)"
              class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
              + Create Task
            </button>
          </div>
        }

        <!-- Task List -->
        @if (!loading() && tasks().length > 0) {
          <div class="space-y-3">
            @for (task of filteredTasks(); track task.id) {
              <div class="bg-white rounded-xl border border-secondary-200 p-5 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-1">
                      <h3 class="font-semibold text-secondary-900"
                        [class.line-through]="task.status === 'completed'"
                        [class.text-secondary-400]="task.status === 'completed'">
                        {{ task.title }}
                      </h3>
                      <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                        [class.bg-green-100]="task.status === 'completed'"
                        [class.text-green-700]="task.status === 'completed'"
                        [class.bg-yellow-100]="task.status === 'in_progress'"
                        [class.text-yellow-700]="task.status === 'in_progress'"
                        [class.bg-gray-100]="task.status === 'pending'"
                        [class.text-gray-600]="task.status === 'pending'">
                        {{ task.status.replace('_', ' ') }}
                      </span>
                      <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                        [class.bg-red-100]="task.priority === 'high'"
                        [class.text-red-700]="task.priority === 'high'"
                        [class.bg-blue-100]="task.priority === 'medium'"
                        [class.text-blue-700]="task.priority === 'medium'"
                        [class.bg-gray-100]="task.priority === 'low'"
                        [class.text-gray-600]="task.priority === 'low'">
                        {{ task.priority }}
                      </span>
                    </div>
                    @if (task.description) {
                      <p class="text-sm text-secondary-500 mt-1">{{ task.description }}</p>
                    }
                    <div class="flex gap-4 mt-2 text-xs text-secondary-400">
                      @if (task.dueDate) {
                        <span>Due: {{ task.dueDate | date:'MMM d, yyyy' }}</span>
                      }
                      <span>Created: {{ task.createdAt | date:'MMM d, yyyy' }}</span>
                    </div>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <button (click)="startEdit(task)"
                      class="text-secondary-400 hover:text-primary-600 transition-colors p-1">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button (click)="deleteTask(task.id)"
                      class="text-secondary-400 hover:text-red-600 transition-colors p-1">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </main>
    </div>
  `
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedFilter = signal<string>('all');
  readonly showCreateForm = signal(false);
  readonly editingTask = signal<Task | null>(null);

  // Form fields
  formTitle = '';
  formDescription = '';
  formPriority = 'medium';
  formStatus = 'pending';
  formDueDate = '';

  readonly filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ];

  readonly filteredTasks = computed(() => {
    const filter = this.selectedFilter();
    const all = this.tasks();
    if (filter === 'all') return all;
    return all.filter(t => t.status === filter);
  });

  constructor() {
    this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const tasks = await this.taskService.getAll();
      this.tasks.set(tasks);
    } catch (e: any) {
      this.error.set(e.error?.message || 'Failed to load tasks');
    } finally {
      this.loading.set(false);
    }
  }

  async createTask(): Promise<void> {
    this.loading.set(true);
    try {
      await this.taskService.create({
        title: this.formTitle,
        description: this.formDescription || undefined,
        priority: this.formPriority,
        status: this.formStatus,
        dueDate: this.formDueDate || undefined,
      });
      this.cancelForm();
      await this.loadTasks();
    } catch (e: any) {
      this.error.set(e.error?.message || 'Failed to create task');
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(task: Task): void {
    this.editingTask.set(task);
    this.formTitle = task.title;
    this.formDescription = task.description || '';
    this.formPriority = task.priority;
    this.formStatus = task.status;
    this.formDueDate = task.dueDate ? task.dueDate.split('T')[0] : '';
    this.showCreateForm.set(true);
  }

  async updateTask(): Promise<void> {
    const task = this.editingTask();
    if (!task) return;
    this.loading.set(true);
    try {
      await this.taskService.update(task.id, {
        title: this.formTitle,
        description: this.formDescription || undefined,
        priority: this.formPriority,
        status: this.formStatus,
        dueDate: this.formDueDate || undefined,
      });
      this.cancelForm();
      await this.loadTasks();
    } catch (e: any) {
      this.error.set(e.error?.message || 'Failed to update task');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteTask(id: number): Promise<void> {
    if (!confirm('Delete this task?')) return;
    try {
      await this.taskService.delete(id);
      await this.loadTasks();
    } catch (e: any) {
      this.error.set(e.error?.message || 'Failed to delete task');
    }
  }

  cancelForm(): void {
    this.showCreateForm.set(false);
    this.editingTask.set(null);
    this.formTitle = '';
    this.formDescription = '';
    this.formPriority = 'medium';
    this.formStatus = 'pending';
    this.formDueDate = '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
