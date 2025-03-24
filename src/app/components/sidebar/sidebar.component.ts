import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from 'src/app/services/auth.service';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatListModule, MatIconModule, RouterModule, MatDialogModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  username: string;
  confirmationDialog = inject(MatDialog);

  constructor (readonly authService: AuthService) {
    this.username = this.authService.getUserDetails()?.username || '';
  }

  onLogout(event: Event): void {
    event.preventDefault();
    const dialogRef = this.confirmationDialog.open(ConfirmationDialogComponent, {
      data: {
        type: 'default',
        title: 'Sign out',
        message: 'Are you sure you want to sign out?',
        subMessage: 'All unsaved changes will be lost.',
        positiveTxt: 'Sign out',
        negativeTxt: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(isConfirm => {
      if (isConfirm) {
        this.authService.logout();
      }
    })
  }
}
