import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatDividerModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  fromRoute: string = '';

  constructor(readonly router: Router, readonly route: ActivatedRoute, readonly location: Location) { 
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setBreadcrumbs();
      });
      this.setBreadcrumbs();
  }

  setBreadcrumbs(): void {
    this.fromRoute = sessionStorage.getItem('fromRoute') || '';

    this.breadcrumbs = this.createBreadcrumbs(this.route.root);
    if (this.router.url === '/' || this.breadcrumbs.length <= 1) {
      this.breadcrumbs[0] = { label: 'To do' };
    } else {
      this.breadcrumbs[0] = { label: 'Back' };
    }
    this.overrideBreadcrumbs();
  }

  createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children = route.children;

    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      if (child.outlet !== 'primary') continue;

      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') url += `/${routeURL}`;

      breadcrumbs.push({
        label: child.snapshot.data['breadcrumb'],
        url,
      });
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  overrideBreadcrumbs(): void {
    if (this.breadcrumbs[1]?.label === 'To do') {
      sessionStorage.removeItem('fromRoute');
    } else if (this.breadcrumbs[1]?.label === 'View Task') {
      this.fromRoute = '';
      sessionStorage.setItem('fromRoute', this.breadcrumbs[1]?.label );
    } else if (this.breadcrumbs[1]?.label === 'Edit Task' && this.fromRoute) {
      this.breadcrumbs[1].label = 'Edit';
    }
  }

  goBack() {
    this.location.back()
  }
}
