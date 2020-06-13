import { Subscription } from 'rxjs';
import { AlertService } from './../../servicres/alert.services';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = 3000;
  public text: string;
  // тип алерта
  public type = 'success';
  aSub: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.aSub = this.alertService.alert$.subscribe(alert => {
      this.text = alert.text;
      this.type = alert.type;

      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        this.text = '';
      }, this.delay);
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
  
}
