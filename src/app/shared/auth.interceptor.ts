import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './../admin/shared/servicres/auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private router: Router ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      req = req.clone({
        setParams: {
          auth: this.authService.token
        }
      });
    }
    // метод handle возвращает стрим
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('[Interceptor Error]:', error);
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/admin', 'login'], {
              queryParams: {
                authFailed: true
              }
            });
          }
          return throwError(error);
        })
      );
  }

}
