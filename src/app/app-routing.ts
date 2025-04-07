import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [RefreshGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    title: 'NavTask - Home',
    children: [
      {
        path: '',
        redirectTo: 'todo-list',
        pathMatch: 'full'
      },
      {
        path: 'todo-list',
        loadComponent: () => import('./pages/home/todo-list/todo-list.component').then(m => m.TodoListComponent),
        data: { breadcrumb: 'To do' }
      },
      {
        path: 'todo-list/:action',
        loadComponent: () => import('./pages/home/todo-form/todo-form.component').then(m => m.TodoFormComponent),
        data: { breadcrumb: 'New Task' }
      },
      {
        path: 'todo-list/view/:action/:taskId',
        loadComponent: () => import('./pages/home/todo-form/todo-form.component').then(m => m.TodoFormComponent),
        data: { breadcrumb: 'Edit Task' }
      },
      {
        path: 'todo-list/view/:taskId',
        loadComponent: () => import('./pages/home/todo-view/todo-view.component').then(m => m.TodoViewComponent),
        data: { breadcrumb: 'View Task' }
      }
    ]
  },
  { path: '**', redirectTo: 'auth' }
];