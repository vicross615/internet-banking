import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillsPaymentRoutingModule } from './bills-payment-routing.module';
import { BillsPaymentComponent } from './bills-payment.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    BillsPaymentRoutingModule,
    SharedModule
  ],
  declarations: [
    BillsPaymentComponent,
  ]
})
export class BillsPaymentModule { }
