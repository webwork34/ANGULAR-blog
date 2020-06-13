import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from './shared/servicres/auth.guard';
import { SearchPipe } from './shared/search.pipe';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AlertService } from './shared/servicres/alert.services';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CreatePageComponent,
    EditPageComponent,
    SearchPipe,
    AlertComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      // зарегистрируем роуты для админки
      {
        path: '', component: AdminLayoutComponent, children: [
          // когда будем попадать на страницу admin - будем делать redirect
          // на страницу логина, чтобы войти
          {path: '', redirectTo: '/admin/login', pathMatch: 'full'},
          {path: 'login', component: LoginPageComponent},
          {path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard]},
          {path: 'create', component: CreatePageComponent, canActivate: [AuthGuard]},
          {path: 'post/:id/edit', component: EditPageComponent, canActivate: [AuthGuard]}
        ]
      }
    ])
  ],
  exports: [RouterModule],
  providers: [AuthGuard, AlertService]
})

export class AdminModule {
}
