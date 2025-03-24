import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priority } from 'src/app/enums/task.enum';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority-badge.component.html',
  styleUrls: ['./priority-badge.component.scss']
})
export class PriorityBadgeComponent {
  @Input() priority: keyof typeof Priority = 'LOW'

  get priorityTxt (): string {
    return Priority[this.priority]
  }
}
