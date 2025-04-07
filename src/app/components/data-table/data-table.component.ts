import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Task } from 'src/app/models/task.model';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { RouterModule } from '@angular/router';
import { TasksService } from 'src/app/services/tasks.service';
import { Subscription } from 'rxjs';
import { DueDateDirective } from 'src/app/directives/due-date.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    PriorityBadgeComponent,
    StatusBadgeComponent,
    DueDateDirective
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent {
  @Input() data: Array<Task> = [];
  @Input() filterValues: string = '';
  @Output() handleRefresh = new EventEmitter();

  displayedColumns: string[] = [
    'select',
    'title',
    'dateDue',
    'priority',
    'status',
    'edit',
  ];
  dataSource = new MatTableDataSource<Task>([]);
  selection = new SelectionModel<Task>(true, []);
  expandedTask: Task | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  datatableSubscription$ = new Subscription();

  constructor(readonly taskService: TasksService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue) {
      this.dataSource.data = changes['data']?.currentValue;
      this.updateDataSource();
    }
    if (changes['filterValues']?.currentValue) {
      this.dataSource.filter = changes['filterValues']?.currentValue;
    }
  }

  ngAfterViewInit() {
    this.updateDataSource();
  }

  updateDataSource(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.selection.clear();
  }

  customFilterPredicate() {
    return (data: any, filter: string): boolean => {
      const filterObj = JSON.parse(filter);

      const statusMatch =
        filterObj.status.length === 0 || filterObj.status.includes(data.status);

      const priorityMatch =
        filterObj.priority.length === 0 ||
        filterObj.priority.includes(data.priority);

      return statusMatch && priorityMatch;
    };
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Task): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.title + 1
    }`;
  }

  isExpanded(task: Task) {
    return this.expandedTask === task;
  }

  onRowExpand(task: Task) {
    this.expandedTask = this.isExpanded(task) ? null : task;
  }

  onDeleteTask(): void {
    this.datatableSubscription$ = this.taskService.handleDeleteTask(this.selection.selected).subscribe(
     res => {
       if (res) {
         this.handleRefresh.emit(true);
       }
     }
    )
   }

   ngOnDestroy(): void {
    this.datatableSubscription$.unsubscribe();
  }
}
