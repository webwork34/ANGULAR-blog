import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, FbCreateResponse } from './interfaces';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  // этотсервис будет работать с backend, поэтому инжектируем HttpClient
  constructor(private http: HttpClient) {}

  // принимаем обьект post, который передаем из формы
  create(post: Post): Observable<Post> {
    // чтобы создавать новые эл-ты - вызываем метод post
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
    // map позволяет трансформировать данные из стрима
      .pipe(map((response: FbCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      }));
  }

  getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
    // распарсим отвтет от FireBase
      .pipe(map((response: {[key: string]: any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }));
      }));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
    .pipe(map((post: Post) => {
      return {
        ...post,
        id,
        date: new Date(post.date)
      };
    }))
  }

  // создадим метод для обновления поста
  // post.id - id того поста, который редактируем
  update(post: Post): Observable<Post> {
    // patch - позволяет частично обновлять данные
    return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post);
  }

}
