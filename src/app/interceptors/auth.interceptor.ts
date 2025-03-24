import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.authService.getAccessToken();
    const authReq = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;

    if (token && !request.url.includes('/auth')) {
      return next.handle(authReq).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.authService.refreshAccessToken().pipe(
              switchMap(() => next.handle(request)),
              catchError(() => {
                this.authService.logout();
                return throwError(() => new Error('Session expired, please log in again.'));
              })
            );
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }
}
