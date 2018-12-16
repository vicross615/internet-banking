import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomerRoutingModule} from './customer-routing.module';
import {SharedModule} from '../shared/shared.module';
import { NgxCarouselModule } from 'ngx-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsComponent } from './notifications/notifications.component';




@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    NgxCarouselModule,
    NgbModule,
  ],
  exports: [],
  declarations: [NotificationsComponent]
})
export class CustomerModule { }
