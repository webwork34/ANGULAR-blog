import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PostPageComponent } from './post-page/post-page.component';


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      // роут, который будет делать редирект на главную страницу
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: '', component: HomePageComponent},
      {path: 'post/:id', component: PostPageComponent}
    ]
  },
  // пропишем корневой обьект, который будет вести на модуль админа
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];

@NgModule({
  // зададим стратегию загрузки lazyloading модулей. Для этого передаем
  // 2м параметром обьект конфигураций в метод forRoot
  // будем заходить в блог, он сразу будет загружаться и в фоне
  // будет загружаться админка
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
