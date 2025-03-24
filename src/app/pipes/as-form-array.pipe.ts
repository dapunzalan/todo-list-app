/* Copyright (c) 2024 Accenture . All rights reserved.

// <copyright company='Accenture'>
// Copyright (c) 2024 Accenture.  All rights reserved.
// Reproduction or transmission in whole or in part, in any form or by any means,
// electronic, mechanical or otherwise, is prohibited without the prior written
// consent of the copyright owner.
// </copyright>

*/
import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Pipe({
    name: 'asFormArray',
    standalone: true
})
export class AsFormArrayPipe implements PipeTransform {
  transform(value: AbstractControl): FormArray {
    return value as FormArray;
  }
}
