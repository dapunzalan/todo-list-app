import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'todo-list-app';

  readonly matIconRegistry = inject(MatIconRegistry);
  readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/google.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'facebook',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/facebook.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'alert',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/alert.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/delete.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/edit.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'upload',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/upload.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'cancelled',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cancelled.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'complete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/complete.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'done',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/done.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'not_done',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/not_done.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'in_progress',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_progress.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'not_started',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/not_started.svg')
    );
  }
}
