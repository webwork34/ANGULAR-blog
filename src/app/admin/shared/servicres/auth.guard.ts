import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// будем использовать на уровне админского модуля, поэтому не пишем
// provideIn: root, а регистрируем его в admin.module.ts
@Injectable()
// сервис становится гвардом, когда имплементируемся от интерфейса
// CanActivate
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>  | Promise<boolean> | boolean {
    // если есть токен - дадим возможность зайти на нужную страницу
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // иначе сделаем logout и редирект на страницу логина
      this.authService.logout();
      this.router.navigate(['/admin', 'login'], {
        // передадим query параметр, который будет указан после знака
        // вопроса в адрессной строке
        queryParams: {
          loginAgain: true
        }
      });
    }
  }

}
