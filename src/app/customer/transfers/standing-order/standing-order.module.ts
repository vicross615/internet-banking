import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingOrderComponent } from './standing-order.component';
import { SharedModule } from '../../../shared/shared.module';
import { StandingOrderRoutingModule } from './standing-order-routing.module';


@NgModule({
  imports: [
    CommonModule,
    StandingOrderRoutingModule,
    SharedModule
  ],
  declarations: [StandingOrderComponent]
})
export class StandingOrderModule { }
