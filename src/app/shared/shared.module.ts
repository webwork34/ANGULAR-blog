import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';


@NgModule({
  imports: [
    HttpClientModule,
    QuillModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    // добавляем в exports, чтобы этот модуль получил публичный api
    // и другие модули могли это видеть
    QuillModule
  ]
})
export class SharedModule {  }
