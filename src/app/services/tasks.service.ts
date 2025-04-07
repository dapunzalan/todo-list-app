import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  readonly apiUrl = environment.server.endpoint;
  userId: string = '';

  constructor(
    readonly http: HttpClient,
    readonly authService: AuthService,
    readonly confirmationDialog: MatDialog,
    readonly snackbarService: SnackbarService
  ) {
    this.getUserId();
  }

  getUserId(): void {
    const userId = JSON.parse(sessionStorage.getItem('userDetails') ?? '')?.userId;
    this.userId = userId ?? this.authService.getUserDetails()?.userId;
  }

  addNewTask(payload: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/task/create`, payload);
  }

  updateTask(taskId: string, payload: FormData): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/task/update/${taskId}`, payload);
  }

  getAllTask(): Observable<Array<Task>> {
    this.getUserId();
    return this.http.get<Array<Task>>(`${this.apiUrl}/task/${this.userId}`);
  }

  getTaskById(taskId: string): Observable<Task> {
    this.getUserId();
    return this.http.get<Task>(`${this.apiUrl}/task/${this.userId}/${taskId}`);
  }

  deleteTask(taskIds: Array<string>): Observable<{ message: string}> {
    return this.http.delete<{ message: string}>(`${this.apiUrl}/task/delete`, {
      body: taskIds,
    });
  }

  handleDeleteTask(tasks: Array<Task>): Observable<boolean> {
    const names = tasks.map((d) => d.title);
    const dialogRef = this.confirmationDialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          type: 'delete',
          message:
            names.length > 1 ? 'Tasks will be deleted.' : 'Delete this Task?',
          positiveTxt: 'Delete',
          negativeTxt: 'Cancel',
          names,
        },
      }
    );
    return dialogRef.afterClosed().pipe(
      switchMap((isConfirm) => {
        if (isConfirm) {
          const taskIds = tasks.map((d) => d.taskId);
          return this.deleteTask(taskIds).pipe(
            switchMap(response => {
              this.snackbarService.openSnackbar(response?.message)
              return of(true)
            }),
            catchError((response) => {
              this.snackbarService.openSnackbar(response?.error.message)
              return of(false)
            })
          );
        }
        return of(false);
      })
    );
  }
}
