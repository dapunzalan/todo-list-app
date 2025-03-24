import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormAction, SelectType } from 'src/app/models/task-form.model';

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
      MatIconModule
    ],
  providers: [ DecimalPipe ],
  templateUrl: './subtask-form.component.html',
  styleUrls: ['./subtask-form.component.scss']
})
export class SubtaskFormComponent {
  @Input() formArray!: FormArray;
  @Input() formAction: FormAction = 'add';
  
  subtaskStatus: SelectType[] = [
    {value: 'NOT_DONE', label: 'Not Done'},
    {value: 'DONE', label: 'Done'},
  ];

  constructor(readonly fb: FormBuilder, readonly decimalPipe: DecimalPipe) {}

  get subtaskGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  createSubtaskField(): FormGroup {
    return this.fb.group({
       title: [`Subtask ${this.decimalPipe.transform(this.subtaskGroups.length + 1, '2.0')}`, Validators.required],
       status: [{value: 'NOT_DONE', disabled: this.formAction === 'add'}, Validators.required,]
    });
  }

  addSubTask(): void {
    this.formArray.push(this.createSubtaskField());
  }

  removeSubtask(index: number): void {
    this.formArray.removeAt(index);
  }
}
