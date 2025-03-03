import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: '',
        redirectTo: 'todo-list',
        pathMatch: 'full'
      },
      {
        path: 'todo-list',
        loadComponent: () => import('./pages/home/todo-list/todo-list.component').then(m => m.TodoListComponent),
      }
    ]
  },
];