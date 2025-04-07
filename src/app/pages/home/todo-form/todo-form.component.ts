import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subtask, Task } from 'src/app/models/task.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
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
    SubtaskFormComponent,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule, DatePipe],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TodoFormComponent implements OnDestroy {
  todoFormGroup: FormGroup;
  previousFormValues: any = null;
  formAction: FormAction = 'add';
  taskId: string = '';

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('myFileInput') myFileInput!: ElementRef;

  priorityList: SelectType[] = TASK_PRIORITY;
  statusList: SelectType[] = TASK_STATUS;

  selectedFileData: Array<any> = [];
  previousFileData: Array<any> = [];

  fileErrorMsg: string = '';
  progressFileName: string = 'File';
  progressValue: number = 0;
  isUploadInProgress = false;

  constructor(
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly _injector: Injector,
    readonly datePipe: DatePipe,
    readonly location: Location,
    readonly taskService: TasksService,
    readonly authService: AuthService,
    readonly route: ActivatedRoute,
    readonly snackbarService: SnackbarService,
    readonly cdr: ChangeDetectorRef
  ) {
    this.todoFormGroup = this.fb.group(
      {
        priority: ['', Validators.required],
        status: ['NOT_STARTED', Validators.required],
        title: ['Task 01', Validators.required],
        dateCreated: [{ value: this.formatDate(new Date()), disabled: true }],
        dateCompletion: [
          { value: this.formatDate(new Date()), disabled: true },
        ],
        dueDate: ['', Validators.required],
        details: [''],
        attachments: [''],
        subtasks: this.fb.array([]),
      },
      { validators: dueDateValidator() }
    );
  }

  get f(): { [key: string]: AbstractControl<any, any> } {
    return this.todoFormGroup.controls;
  }

  get dueDateError() {
    return this.f['dueDate'].hasError('dueDateError');
  }

  get isCompleteDisabled(): boolean {
    const rawData = this.f['subtasks'].getRawValue() || [];
    const subtasksNotDoneLen = rawData.filter(
      (d: Subtask) => d.status === 'NOT_DONE'
    )?.length;
    return this.formAction === 'edit' && subtasksNotDoneLen > 0;
  }

  get isShowMarkAsComplete(): boolean {
    const rawData = this.f['subtasks'].getRawValue() || [];
    const subtasksNotDoneLen = rawData.filter(
      (d: Subtask) => d.status === 'NOT_DONE'
    )?.length;
    return (
      subtasksNotDoneLen === 0 &&
      rawData.length > 0 &&
      this.f['status'].value !== 'COMPLETE'
    );
  }

  get isFormValuesNotChanged(): boolean {
    return (
      this.formAction === 'edit' &&
      JSON.stringify(this.previousFormValues) ===
        JSON.stringify(this.todoFormGroup.getRawValue()) &&
      JSON.stringify(this.previousFileData) ===
        JSON.stringify(this.selectedFileData)
    );
  }

  ngOnInit(): void {
    const paramMap = this.route.snapshot.paramMap;
    this.formAction = paramMap.get('action') as FormAction;
    this.taskId = paramMap.get('taskId') as string;
    if (this.formAction === 'edit' && this.taskId) {
      this.getTaskDetails();
    }
  }

  getTaskDetails(): void {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (response: Task) => {
        this.todoFormGroup.patchValue({
          priority: response?.priority,
          status: response?.status,
          title: response?.title,
          dateCreated: this.formatDate(new Date(response?.dateCreated)),
          dueDate: new Date(response?.dateDue),
          details: response?.details,
        });

        this.f['priority'].disable();
        this.f['title'].disable();

        if (response.attachments.length > 0) {
          response.attachments.forEach((attachment) => {
            this.selectedFileData.push({
              attachmentId: attachment.attachmentId,
              file: {
                name: attachment.filename,
                size: attachment.fileSize,
              },
              urlPath: this.authService.serverURL + attachment.filePath,
            });
          });
          this.previousFileData = structuredClone(this.selectedFileData);
        }

        if (response.subtasks.length > 0) {
          const subtaskArray = this.todoFormGroup.get('subtasks') as FormArray;
          subtaskArray.clear();
          response.subtasks.forEach((subtask) => {
            subtaskArray.push(
              this.fb.group({
                subtaskId: [subtask.subtaskId],
                title: [subtask.title, Validators.required],
                status: [subtask.status, Validators.required],
              })
            );
          });
          subtaskArray.updateValueAndValidity();
        }

        this.previousFormValues = structuredClone(
          this.todoFormGroup.getRawValue()
        );
      },
    });
  }
  createSubtaskField(): FormGroup {
    return this.fb.group({
      subtaskId: [''],
      title: ['', Validators.required],
      status: ['', Validators.required],
    });
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
      }
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

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // To validate uploaded files
  handleFiles(files: FileList) {
    const fileItems = Array.from({ length: files.length }).map((_, i) =>
      files.item(i)
    );

    this.fileErrorMsg = '';

    if (fileItems.length > 0) {
      if (fileItems.length + this.selectedFileData.length <= 5) {
        this.isUploadInProgress = true;
        this.cdr.detectChanges();

        fileItems.forEach(async (file) => {
          if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
            const maxSizeInMB = 10;
            const fileSizeInMB = file.size / (1024 * 1024);

            if (fileSizeInMB <= maxSizeInMB) {
              this.progressValue = 0;

              while (this.progressValue < 100) {
                this.progressValue += Math.floor(Math.random() * 20) + 5;
                if (this.progressValue > 100) this.progressValue = 100;

                this.progressFileName = file.name;
                this.cdr.detectChanges();
                await this.delay(500);
              }

              this.selectedFileData.push({
                attachmentId: null,
                file: new File([file], file.name),
                urlPath: URL.createObjectURL(file),
              });

              this.cdr.detectChanges();
              await this.delay(700);
            } else {
              this.fileErrorMsg = `The specified file "${file.name}" could not be uploaded. The file size exceeds the allowed limit of ${maxSizeInMB} MB.`;
            }
          } else {
            this.fileErrorMsg = `The specified file "${
              file?.name ?? 'Unknown'
            }" could not be uploaded. The file is invalid, or not supported.`;
          }

          this.isUploadInProgress = false;
          this.cdr.detectChanges();
        });
      } else {
        this.fileErrorMsg = `Failed to upload. You can only upload a maximum of 5 files.`;
      }
    }
  }

  onRemoveAttachment(index: number) {
    this.selectedFileData = this.selectedFileData.filter(
      (item, i) => i !== index
    );
    this.myFileInput.nativeElement.value = '';
  }

  onCancel(): void {
    this.location.back();
  }

  onSave(): void {
    if (!this.todoFormGroup.invalid) {
      const formData = new FormData();
    const userId = this.authService.getUserDetails()?.userId;
    const formKeyValues = Object.entries(this.todoFormGroup.value);

    formData.append('userId', `${userId}`);
    for (const [key, value] of formKeyValues) {
      if (key !== 'attachments' && key !== 'subtasks')
        formData.append(key, `${value}`);
      if (key === 'subtasks')
        formData.append(
          'subtasks',
          JSON.stringify(this.f['subtasks'].getRawValue())
        );
    }
    if (this.selectedFileData.length > 0) {
      this.selectedFileData.forEach((f) =>
        formData.append('attachments', f.file)
      );
    }
    switch (this.formAction) {
      case 'add': {
        this.handleCreate(formData);
        break;
      }
      case 'edit': {
        const attachmentIds = this.selectedFileData
          .map((file) => file.attachmentId)
          .filter((id) => id);
        formData.append('attachmentIds', JSON.stringify(attachmentIds));
        this.handleUpdate(formData);
        break;
      }
    }
    } else {
      this.todoFormGroup.markAllAsTouched();
    }
  }

  handleCreate(formData: FormData): void {
    this.taskService.addNewTask(formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.snackbarService.openSnackbar(res?.message);
          this.onCancel();
        }
      },
      error: (err) => {
        this.snackbarService.openSnackbar(err?.error?.message);
      },
    });
  }

  handleUpdate(formData: FormData): void {
    this.taskService.updateTask(this.taskId, formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.snackbarService.openSnackbar(res?.message);
          this.onCancel();
        }
      },
      error: (err) => {
        this.snackbarService.openSnackbar(err?.error?.message);
      },
    });
  }

  onMarkAsComplete(): void {
    this.f['status'].patchValue('COMPLETE');
    this.f['status'].updateValueAndValidity();
  }

  ngOnDestroy() {
    if (this.selectedFileData.length > 0) {
      this.selectedFileData.forEach((d) => {
        URL.revokeObjectURL(d.urlPath);
      });
    }
  }
}
