import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentHistoryComponent } from './payment-history.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentHistoryComponent,
    data: {
      title: 'Payment History',
      icon: 'icon-corner-down-left',
      caption: 'View your last 10 payments',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentHistoryRoutingModule { }
