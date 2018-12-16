import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../../_services/alert.service';
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';

@Component({
  moduleId: module.id,
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})

export class AlertComponent implements OnInit, OnDestroy  {
  message: any;

  constructor(private alertServices: AlertService) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.alertServices.getMessage().pipe(untilComponentDestroyed(this)) // <--- method to unsubscribe when comp destroys
    .subscribe(
      message => {this.message = message; }
    );
  }

  ngOnDestroy(): void {

  }

}
