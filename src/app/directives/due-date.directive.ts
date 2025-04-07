import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Priority, Status } from '../enums/task.enum';

@Directive({
  selector: '[appDueDate]',
  standalone: true
})
export class DueDateDirective implements OnInit {
  @Input('appDueDate') dueDate!: string; // Main date input
  @Input() status: keyof typeof Status ='NOT_STARTED';
  @Input() priority: keyof typeof Priority = 'LOW'


  constructor(readonly el: ElementRef, readonly renderer: Renderer2) {}

  ngOnInit() {
    if (this.status !== 'COMPLETE') {
      const hrsLater = this.priority === 'CRITICAL' ? 48 : 24;
      if (this.isOverdue(this.dueDate)) {
        this.renderer.setStyle(this.el.nativeElement, 'color', '#CA0061');
        const messageElement = this.renderer.createElement('div');
        const text = this.renderer.createText('Overdue');
        this.renderer.appendChild(messageElement, text);
        this.renderer.setStyle(messageElement, 'font-size', '12px');
        this.renderer.appendChild(this.el.nativeElement, messageElement);
      } else if (this.isDueWithinHours(this.dueDate, hrsLater) || this.isToday(this.dueDate)) {
        this.renderer.setStyle(this.el.nativeElement, 'color', '#009292');
        const messageElement = this.renderer.createElement('div');
        const text = this.renderer.createText(this.isToday(this.dueDate) ? 'Today' : this.isTomorrow(this.dueDate) ? 'Tomorrow' : 'In the next 2 days');
        this.renderer.appendChild(messageElement, text);
        this.renderer.setStyle(messageElement, 'font-size', '12px');
        this.renderer.appendChild(this.el.nativeElement, messageElement);
      }
    }
  }

  private isDueWithinHours(date: string, hr: number): boolean {
    const dueDate = new Date(date);
    const now = new Date();
    const hoursLater = new Date(now.getTime() + hr * 60 * 60 * 1000);
    return dueDate > now && dueDate <= hoursLater;
  }

  private isOverdue(date: string): boolean {
    const dueDate = new Date(date);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  isToday(date: string): boolean {
    const dueDate = new Date(date);
    const today = new Date();
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  }

  isTomorrow(date: string): boolean {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return (
      dueDate.getDate() === tomorrow.getDate() &&
      dueDate.getMonth() === tomorrow.getMonth() &&
      dueDate.getFullYear() === tomorrow.getFullYear()
    );
  }
  
}
