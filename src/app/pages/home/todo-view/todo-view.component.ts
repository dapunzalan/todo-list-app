import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TasksService } from 'src/app/services/tasks.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { PriorityBadgeComponent } from 'src/app/components/priority-badge/priority-badge.component';
import { StatusBadgeComponent } from 'src/app/components/status-badge/status-badge.component';
import { KiloBytesPipe } from 'src/app/pipes/kilobytes.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    PriorityBadgeComponent,
    StatusBadgeComponent,
    KiloBytesPipe,
  ],
  templateUrl: './todo-view.component.html',
  styleUrls: ['./todo-view.component.scss'],
})
export class TodoViewComponent {
  taskDetails: Task | null = null;
  taskViewSubscription$ = new Subscription();

  constructor(
    readonly taskService: TasksService,
    readonly authService: AuthService,
    readonly route: ActivatedRoute,
    readonly location: Location
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId') ?? '';
    if (!taskId) {
      this.location.back();
    }
    this.taskService.getTaskById(taskId).subscribe({
      next: (response: Task) => {
        this.taskDetails = response;
      },
      error: (err) => {
        this.location.back();
      },
    });
  }

  onDeleteTask(): void {
   this.taskViewSubscription$ = this.taskService.handleDeleteTask([this.taskDetails as Task]).subscribe(
    res => {
      if (res) {
        this.location.back();
      }
    }
   )
  }

  ngOnDestroy(): void {
    this.taskViewSubscription$.unsubscribe();
  }
}
