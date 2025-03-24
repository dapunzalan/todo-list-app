import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, SidebarComponent, BreadcrumbsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

}
