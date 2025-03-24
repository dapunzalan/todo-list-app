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

  constructor(readonly router: Router, readonly route: ActivatedRoute, readonly location: Location) {
    this.breadcrumbs[0] = { label: 'To do'};
  }

  ngOnInit() {
    this.setBreadcrumbs();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setBreadcrumbs();
      });
  }

  setBreadcrumbs(): void {
    this.breadcrumbs = this.createBreadcrumbs(this.route.root);
    if (this.router.url === '/' || this.breadcrumbs.length <= 1) {
      this.breadcrumbs[0] = { label: 'To do' };
    } else {
      this.breadcrumbs[0] = { label: 'Back' };
    }
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

  goBack() {
    this.location.back()
  }
}
