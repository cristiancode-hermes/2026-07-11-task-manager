import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/tasks';

  async getAll(status?: string): Promise<Task[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return lastValueFrom(
      this.http.get<Task[]>(this.baseUrl, { params })
    );
  }

  async getById(id: number): Promise<Task> {
    return lastValueFrom(
      this.http.get<Task>(`${this.baseUrl}/${id}`)
    );
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    return lastValueFrom(
      this.http.post<Task>(this.baseUrl, dto)
    );
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    return lastValueFrom(
      this.http.put<Task>(`${this.baseUrl}/${id}`, dto)
    );
  }

  async delete(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.baseUrl}/${id}`)
    );
  }
}
