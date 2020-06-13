import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from './../shared/servicres/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  // создадим переменную для блокировки кнопки, во время работы с сервером
  isSubmitted = false;
  // создадим переменную, для отображения ообщения при обработке
  // params['loginAgain']
  message: string;

  constructor(public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // обработаем queryParams, которые передали в auth.guard.ts
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Вам нужно авторизоваться в системе';
      } else if (params['authFailed']) {
        this.message = 'Сессия истекла. Вам нужно авторизоваться в системе снова';
      }
    });

    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.login(user).subscribe(() => {
      this.form.reset();
      // если авторизация прошла успешно - переправляем пользователя на
      // другую страницу
      this.router.navigate(['/admin', 'dashboard']);
      this.isSubmitted = false;
      // в случае ошибки ввода email/password - разблокируем кнопку
    }, () => {
      this.isSubmitted = false;
    });

  }
}
