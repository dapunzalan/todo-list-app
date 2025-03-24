import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  readonly apiUrl = environment.server.endpoint
  readonly userId: string = ''; 

  constructor(readonly http: HttpClient, readonly authService: AuthService) { 
    this.userId = this.authService.getUserDetails()?.userId || '';
  }

  addNewTask(payload: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/task/createTask`, payload);
  }

  getAllTask(): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`${this.apiUrl}/task/${this.userId}`);
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/task/${this.userId}/${taskId}`);
  }
}
