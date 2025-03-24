import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthPayload, AuthResponse } from '../models/auth.model';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

type UserDetails = {
  username: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly apiUrl = environment.server.endpoint
  readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  accessToken: string | null = null;
  userDetails: UserDetails | null = null;

  constructor(readonly http: HttpClient, readonly router: Router) {
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      this.userDetails = JSON.parse(userDetails);
    }
  }

  get serverURL (): string {
    return environment.server.url;
  }

  register(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: AuthPayload) {
    return this.http.post(`${this.apiUrl}/auth/login`, payload,  {withCredentials: true} ).pipe(
      tap((res: any) => {
        this.accessToken = res.accessToken;
        this.setUserDetails(res);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  getAccessToken() {
    return this.accessToken;
  }

  setUserDetails(user: UserDetails) {
    this.userDetails = {
      username: user?.username,
      userId: user?.userId
    }
    sessionStorage.setItem('userDetails', JSON.stringify(this.userDetails));
  }

  getUserDetails(): UserDetails | null {
    return this.userDetails;
  }

  refreshAccessToken() {
    return this.http.get(`${this.apiUrl}/auth/refresh-token`, { withCredentials: true }).pipe(
      tap((res: any) => {
        this.accessToken = res.accessToken;
        this.setUserDetails(res);
      }),
      catchError(() => {
        this.logout();
        return [];
      })
    );
  }

  checkAuthStatus() {
    this.refreshAccessToken().subscribe({
      next: () => {
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isAuthenticatedSubject.next(false);
      },
    });
  }

  logout() {
    this.accessToken = null;
    this.isAuthenticatedSubject.next(false);
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe(() => {
      sessionStorage.clear();
      this.router.navigate(['/auth']);
    });
  }
}
