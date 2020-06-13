import { FbAuthResponse } from './../../../shared/interfaces';
import { environment } from './../../../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces';
import { Observable, throwError, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AuthService {

  // заведем переменную, которая будет стримом, для обработки ошибок
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  // метод login - будет логинить в систему
  login(user: User): Observable<any> {
    // добавим это поля для того, чтобы указать срок жизни токена
    // если время жизни токена истекло - будем удалять сессию и
    // нужно будет делать новый логин
    user.returnSecureToken = true;
    // делаем post запрос, чтобы авторизоваться
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout() {
    this.setToken(null);
  }

  // данный метод будет говорить: авторизован пользователь в системе или нет
  isAuthenticated(): boolean {
    // token будет прилетать с сервера
    return !!this.token;
  }

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      // дата, которая будет говорить, когда истечет токен
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email');
        break;
      case 'INVALID_PASSWORD':
          this.error$.next('Неверный password');
        break;
      case 'EMAIL_NOT_FOUND':
          this.error$.next('Такой email не найден');
        break;


    }

    return throwError(error);
  }

}
