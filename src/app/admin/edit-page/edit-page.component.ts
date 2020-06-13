import { AlertService } from './../shared/servicres/alert.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from './../../shared/post.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  post: Post;
  submitted = false;
  uSub: Subscription;

  constructor(private route: ActivatedRoute,
              private postsService: PostsService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getById(params['id']);
      })
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      });
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    this.uSub = this.postsService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }).subscribe(() => {
      this.submitted = false;
      this.alertService.success('Пост был обновлен');
    });
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

}
