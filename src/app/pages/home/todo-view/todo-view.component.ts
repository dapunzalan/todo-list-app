import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from 'src/app/services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { PriorityBadgeComponent } from 'src/app/components/priority-badge/priority-badge.component';
import { StatusBadgeComponent } from 'src/app/components/status-badge/status-badge.component';
import { KiloBytesPipe } from 'src/app/pipes/kilobytes.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-todo-view',
  standalone: true,
  imports: [CommonModule, MatDividerModule, PriorityBadgeComponent, StatusBadgeComponent, KiloBytesPipe],
  templateUrl: './todo-view.component.html',
  styleUrls: ['./todo-view.component.scss'],
})
export class TodoViewComponent {
  taskDetails: Task | null = null;
  constructor(
    readonly taskService: TasksService,
    readonly authService: AuthService,
    readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId') ?? '';
    this.taskService.getTaskById(taskId).subscribe({
      next: (response: Task) => {
        this.taskDetails = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
