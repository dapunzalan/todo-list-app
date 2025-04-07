import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormAction, SelectType } from 'src/app/models/task-form.model';
import { Status } from 'src/app/enums/task.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-subtask-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  providers: [DecimalPipe],
  templateUrl: './subtask-form.component.html',
  styleUrls: ['./subtask-form.component.scss'],
})
export class SubtaskFormComponent {
  @Input() formArray!: FormArray;
  @Input() formAction: FormAction = 'add';
  @Input() status: keyof typeof Status = 'NOT_STARTED';

  subtaskStatus: SelectType[] = [
    { value: 'NOT_DONE', label: 'Not Done' },
    { value: 'DONE', label: 'Done' },
  ];

  constructor(
    readonly fb: FormBuilder,
    readonly decimalPipe: DecimalPipe,
    readonly confirmationDialog: MatDialog,
    readonly snackbarService: SnackbarService,
    readonly cdref: ChangeDetectorRef
  ) {}

  get subtaskGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status'].currentValue) {
      this.status = changes['status'].currentValue;
    }
  }

  createSubtaskField(): FormGroup {
    return this.fb.group({
      subtaskId: [''],
      title: [
        `Subtask ${this.decimalPipe.transform(
          this.subtaskGroups.length + 1,
          '2.0'
        )}`,
        Validators.required,
      ],
      status: [
        { value: 'NOT_DONE', disabled: this.formAction === 'add' },
        Validators.required,
      ],
    });
  }

  addSubTask(): void {
    this.formArray.push(this.createSubtaskField());
  }

  removeSubtask(index: number, label: string): void {
    const names = [label];
    const dialogRef = this.confirmationDialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          type: 'delete',
          message: 'Delete this Subtask?',
          positiveTxt: 'Delete',
          negativeTxt: 'Cancel',
          names,
        },
      }
    )
    dialogRef.afterClosed().subscribe(isConfirm => {
      if (isConfirm) {
        this.formArray.removeAt(index);
        this.formArray.updateValueAndValidity();
        this.cdref.detectChanges();
        this.snackbarService.openSnackbar('Subtask successfully deleted.');
      }
    });
  }

  get isSubtasksDisabled(): boolean {
    return this.status === 'COMPLETE';
  }
}
