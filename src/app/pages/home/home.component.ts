import { Component, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/components/breadcrumbs/breadcrumbs.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    SidebarComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  drawerMode: 'side' | 'over' = 'side';

  constructor(
    readonly breakpointObserver: BreakpointObserver,
    readonly ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.breakpointObserver
        .observe(['(max-width: 1024px)'])
        .subscribe((result) => {
          if (result.matches) {
            this.ngZone.run(() => {
              this.drawerMode = 'over';
              this.drawer.close();
            });
          } else {
            this.ngZone.run(() => {
              this.drawerMode = 'side';
              this.drawer.open();
            });
          }
        });
    });
  }
}
