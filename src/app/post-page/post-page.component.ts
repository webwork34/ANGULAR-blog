import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostsService } from '../shared/post.service';
import { Observable } from 'rxjs';
import { Post } from '../shared/interfaces';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  // создадим стрим post
  post$: Observable<Post>;

  constructor(private route: ActivatedRoute,
              private postsService: PostsService) { }

  ngOnInit() {
    this.post$ = this.route.params
    // switchMap позволит изменить направление стрима от params
    // до нужного стрима
      .pipe(switchMap((params: Params) => {
        // возвращается новый стрим
        return this.postsService.getById(params['id']);
      }));
  }

}
