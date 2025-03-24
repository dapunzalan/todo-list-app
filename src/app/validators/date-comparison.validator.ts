import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dueDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const startDate = new Date(control.get('dateCreated')?.value);
    const endDateControl  = control.get('dueDate');

    if (startDate && endDateControl?.value && startDate >= endDateControl.value) {
      endDateControl.setErrors({ dueDateError: true });
    } else {
      if (endDateControl?.hasError('dueDateError')) {
          const errors = { ...endDateControl.errors };
          delete errors['dueDateError'];
          endDateControl.setErrors(Object.keys(errors).length ? errors : null);
        }
    }

    return null;
  };
};
