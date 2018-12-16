import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryRoutingModule } from './payment-history-routing.module';
import { SharedModule } from '../../../shared/shared.module';
// import { PaymentHistoryCardsComponent } from './payment-history-cards/payment-history-cards.component';
import { PaymentHistoryComponent } from './payment-history.component';


@NgModule({
  imports: [
    CommonModule,
    PaymentHistoryRoutingModule,
    SharedModule
  ],
  declarations: [PaymentHistoryComponent]
})
export class PaymentHistoryModule { }
