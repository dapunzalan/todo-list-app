import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, concatMap, map, Observable, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(readonly authService: AuthService, readonly router: Router) {}

  canActivate() {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      concatMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true);
        } else {
          return this.checkAuthStatus();
        }
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
      if (this.authService.accessToken) {
        this.authService.isAuthenticatedSubject.next(true);
        return of(true);
      } else {
        return this.authService.refreshAccessToken().pipe(concatMap(() => {
          this.authService.isAuthenticatedSubject.next(true);
          return of(true);
        }),
        catchError(() => {
          this.router.navigate(['/auth']);
          this.authService.isAuthenticatedSubject.next(false);
          return of(false);
        }))
      }
  }


}
