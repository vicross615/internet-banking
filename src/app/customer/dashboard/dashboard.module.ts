import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {DashboardComponent} from './dashboard.component';
import {FormsModule} from '@angular/forms';
import {SelectModule} from 'ng-select';
import {SelectOptionService} from '../../shared/elements/select-option.service';
// import {JsonpModule} from '@angular/http';
import {NgxCarouselModule} from 'ngx-carousel';
import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    FormsModule,
    SelectModule,
    SimpleNotificationsModule.forRoot(),
    NgxCarouselModule,
    // JsonpModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [SelectOptionService],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
