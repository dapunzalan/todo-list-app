import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Status } from 'src/app/enums/task.enum';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
@Input() status: keyof typeof Status ='NOT_STARTED';
@Input() isSmall: boolean = false;
@Input() isView: boolean = false;
@Input() dateCompletion: string | null = null;

  get statusTxt (): string {
    return Status[this.status]
  }
}
