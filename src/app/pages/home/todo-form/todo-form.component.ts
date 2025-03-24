import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, Injector, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragDropDirective } from 'src/app/directives/drag-drop.directive';
import { MatIconModule } from '@angular/material/icon';
import { KiloBytesPipe } from 'src/app/pipes/kilobytes.pipe';
import { SubtaskFormComponent } from './subtask-form/subtask-form.component';
import { MatDividerModule } from '@angular/material/divider';
import { AsFormArrayPipe } from 'src/app/pipes/as-form-array.pipe';
import { TasksService } from 'src/app/services/tasks.service';
import { AuthService } from 'src/app/services/auth.service';
import { dueDateValidator } from 'src/app/validators/date-comparison.validator';
import { TASK_PRIORITY, TASK_STATUS } from 'src/app/constants/task.constant';
import { FormAction, SelectType } from 'src/app/models/task-form.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    DragDropDirective,
    KiloBytesPipe,
    AsFormArrayPipe,
    SubtaskFormComponent
  ],
  providers: [MatDatepickerModule, MatNativeDateModule, DatePipe],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TodoFormComponent implements OnDestroy {
  todoFormGroup: FormGroup;
  formAction: FormAction = 'add';

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('myFileInput') myFileInput!: ElementRef;

  priorityList: SelectType[] = TASK_PRIORITY;
  statusList: SelectType[] = TASK_STATUS;

  fileData: Array<any> = [];
  selectedFileData: Array<any> = [];
  fileErrorMsg: string = '';

  constructor (
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly _injector:Injector,
    readonly datePipe: DatePipe,
    readonly location: Location,
    readonly taskService: TasksService,
    readonly authService: AuthService,
    readonly route: ActivatedRoute
  ) {
      this.todoFormGroup = this.fb.group({
        priority: ['', Validators.required],
        status: ['NOT_STARTED', Validators.required],
        title: ['Task 01', Validators.required],
        dateCreated: [{value: this.formatDate(new Date()), disabled: true}, Validators.required],
        dueDate: ['', Validators.required],
        details: [''],
        attachments: [''],
        subtasks: this.fb.array([])
      }, { validators: dueDateValidator() });
  }
  
  get f(): { [key: string]: AbstractControl<any, any>; } {
    return this.todoFormGroup.controls;
  }

  get dueDateError() {
    return this.f['dueDate'].hasError('dueDateError');
  }

  ngOnInit(): void {
    this.formAction = this.route.snapshot.paramMap.get('action') as FormAction;
  }

  formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy') || '';
  }

  triggerResize() {
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      },
    );
  }

  // Handle drag and drop file event
  onFileDropped(files: FileList): void {
    this.handleFiles(files);
  }

  // Handle select file event
  onFileUpload(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    const files = eventTarget.files as FileList;
    this.handleFiles(files);
  }

  // To validate uploaded files
  handleFiles(files: FileList): void {
    const fileItems = Array.from({ length: files.length }).map((_, i) => files.item(i));

    this.fileErrorMsg = '';

    if (fileItems.length > 0) {
      if (fileItems.length + this.selectedFileData.length <= 5 ) {
        fileItems.forEach(file => {
          if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
            const maxSizeInMB = 10;
            const fileSizeInMB = file.size / (1024 * 1024);
  
            if (fileSizeInMB <= maxSizeInMB) {
              const str = file.name.split('.');
              const fileType = str[str.length - 1];
              str.pop();
              const fileName = str.join('');
  
              this.selectedFileData.push({
                file: new File([file], this.modifyFileName(file.name, fileName, fileType)),
                urlPath: URL.createObjectURL(file)
              });
            } else {
              this.fileErrorMsg = `The specified file "${file.name}" could not be uploaded. The file size exceeds the allowed limit of ${maxSizeInMB} MB.`;
            }
          } else {
            this.fileErrorMsg = `The specified file "${file?.name ?? 'Unknown'}" could not be uploaded. The file is invalid, or not supported.`;
          }
        });
      } else {
        this.fileErrorMsg = `Failed to upload. You can only upload a maximum of 5 files.`;
      }
    }
  }

  modifyFileName(fileName: string, appFileName: string, appFileType: string): string {
    let count = 0;
    let modifiedFileName = fileName;
    while (this.fileExists(modifiedFileName)) {
      count++;
      modifiedFileName = `${appFileName}(${count}).${appFileType}`;
    }
    return modifiedFileName;
  }

  fileExists(fileName: string): boolean {
    const data = [...this.fileData, ...this.selectedFileData];
    return data.findIndex(file => file.name === fileName || file.FileName === fileName) !== -1;
  }

  onRemoveAttachment(index: number) {
    this.selectedFileData = this.selectedFileData.filter((item, i) => i !== index);
    this.myFileInput.nativeElement.value = '';
  }

  onCancel(): void {
    this.location.back();
  }

  onSave(): void {
    const formData = new FormData();

    formData.append('userId', `${this.authService.getUserDetails()?.userId}`);
    for (const [key, value] of Object.entries(this.todoFormGroup.value)) {
      if (key !== 'attachments' && key !== 'subtasks') formData.append(key, `${value}`);
      if (key === 'subtasks') formData.append('subtasks', JSON.stringify(this.f['subtasks'].getRawValue()));
      if (key === 'dateCreated') formData.append('dateCreated', `${new Date(this.f['dateCreated'].value)}`);
    }
    if (this.selectedFileData.length > 0) {
      this.selectedFileData.forEach((f) => formData.append('attachments', f.file));
    }
    this.taskService.addNewTask(formData).subscribe({
      next: res => {
        if (res.isSuccess) {
          this.onCancel();
        }
      },
      error: err => console.log(err)
    })
  }

  ngOnDestroy() {
    if (this.selectedFileData.length > 0) {
      this.selectedFileData.forEach(d => {
        URL.revokeObjectURL(d.urlPath);
      });
    }
  }
}
