import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/models/task.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SelectType } from 'src/app/models/task-form.model';
import { TASK_PRIORITY, TASK_STATUS } from 'src/app/constants/task.constant';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Priority, Status } from 'src/app/enums/task.enum';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    DataTableComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TodoListComponent {
  taskList: Array<Task>;
  priorityList: Array<SelectType> = TASK_PRIORITY;
  statusList: Array<SelectType> = TASK_STATUS;
  filterValueDisplay: Array<string> = [];
  priorityFilter: Array<string> = [];
  statusFilter: Array<string> = [];
  filterValues: string = '';

  constructor(
    readonly taskService: TasksService,
    readonly router: Router,
    readonly snackbarService: SnackbarService
  ) {
    this.taskList = [];
  }

  ngOnInit(): void {
    this.onGetAllTasks();
  }

  onGetAllTasks(): void {
    this.taskService.getAllTask().subscribe({
      next: (response) => {
        this.taskList = [...response];
      },
      error: (err) => {
        this.snackbarService.openSnackbar(err?.error.message);
      },
    });
  }

  onNewTask(): void {
    this.router.navigate(['/home/todo-list/add']);
  }

  onSelectFilter(type: 'priority' | 'status', selectedValue: string): void {
    const priorityIndex = this.priorityFilter.findIndex(
      (val) => val === selectedValue
    );
    const statusIndex = this.statusFilter.findIndex(
      (val) => val === selectedValue
    );

    if (type === 'priority' && priorityIndex === -1) {
      if (selectedValue === 'ALL') {
        const priorityValues = TASK_PRIORITY.map((p) => p.value);
        this.priorityFilter = [...new Set(priorityValues)];
      } else {
        this.priorityFilter.push(selectedValue);
      }
    } else if (type === 'status' && statusIndex === -1) {
      if (selectedValue === 'ALL') {
        const statusValues = TASK_STATUS.map((p) => p.value);
        this.statusFilter = [...new Set(statusValues)];
      } else {
        this.statusFilter.push(selectedValue);
      }
    }

    this.applyFilter();
  }

  applyFilter(): void {
    const priorityFilter = structuredClone(this.priorityFilter).map(
      (priority) => Priority[priority as keyof typeof Priority]
    );
    const statusFilter = structuredClone(this.statusFilter).map(
      (status) => Status[status as keyof typeof Status]
    );

    this.filterValueDisplay = [...priorityFilter, ...statusFilter];

    const filterValues = {
      status: this.statusFilter,
      priority: this.priorityFilter,
    };
    this.filterValues = JSON.stringify(filterValues);
  }

  removeFilter(removeValue: string): void {
    this.priorityFilter = this.priorityFilter.filter(
      (value) => Priority[value as keyof typeof Priority] !== removeValue
    );
    this.statusFilter = this.statusFilter.filter(
      (value) => Status[value as keyof typeof Status] !== removeValue
    );
    this.applyFilter();
  }
}
