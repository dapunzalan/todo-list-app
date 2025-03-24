/* Copyright (c) 2024 Accenture . All rights reserved.

// <copyright company='Accenture'>
// Copyright (c) 2024 Accenture.  All rights reserved.
// Reproduction or transmission in whole or in part, in any form or by any means,
// electronic, mechanical or otherwise, is prohibited without the prior written
// consent of the copyright owner.
// </copyright>

*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'kiloBytes',
    standalone: true
})
export class KiloBytesPipe implements PipeTransform {
  transform(value: number): string {
    const fileSizeInMB = value / (1024 * 1024);

    if (fileSizeInMB <= 1) {
      return `${(value / 1024).toFixed(1)} KB`;
    } else {
      return `${fileSizeInMB.toFixed(1)} MB`;
    }
  }
}
