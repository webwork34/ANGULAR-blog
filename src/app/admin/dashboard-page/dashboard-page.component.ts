import { AlertService } from './../shared/servicres/alert.services';
import { PostsService } from './../../shared/post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  // создадим переменные для избежания утечки памяти
  pSub: Subscription;
  dSub: Subscription;
  searchStr = '';

  constructor(private postsService: PostsService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.pSub = this.postsService.getAll().subscribe(posts => {
      this.posts = posts;
    });
  }

  remove(id: string) {
    this.dSub = this.postsService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alertService.danger('Пост был удален');
    });
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }

}
