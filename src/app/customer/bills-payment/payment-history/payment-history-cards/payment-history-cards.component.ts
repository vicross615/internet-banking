import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentHistory } from './payment-history.model';
import { transition, trigger, style, animate, state } from '@angular/animations';
import { BillsPaymentService } from '../../_services/bills-payment.service';
import { UtilitiesService } from '../../../../_services/utilities.service';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-payment-history-cards',
  templateUrl: './payment-history-cards.component.html',
  styleUrls: ['./payment-history-cards.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('500ms ease-in-out', style({opacity: 0}))
      ])
    ]),
    trigger('slideUpDown', [
      state('in', style({height: '*'})),
      transition('* => void', [
        style({height: '*'}),
        animate('300ms', style({height: 0}))
      ]),
      transition('void => *', [
        style({height: 0}),
        animate('300ms', style({height: '*'}))
      ]),
    ])
  ],
})
export class PaymentHistoryCardsComponent implements OnInit, OnDestroy {
  paymentHistory: PaymentHistory[];
  loading = true;
  message: any = 'Loading Payment History...';

  constructor(
    private billsPaymentService: BillsPaymentService,
    private util: UtilitiesService,
    private router: Router
  ) {
    this.billsPaymentService.getPaymentHistoryData();
    this.billsPaymentService.paymentHistory$.pipe(untilComponentDestroyed(this))
    .subscribe(bills => {
      this.paymentHistory = bills.sort();
      for (const h of this.paymentHistory ) {
        if (!h.customerLogo) {
          h.image = 'assets/icon/smashicons/bills-payment/bills-history.svg';
        } else {
          h.image = `data:image/${h.imageType};base64,${h.customerLogo}`;
        }
      }
      console.log(this.paymentHistory);
      this.loading = false;
    });
    this.billsPaymentService.paymentHistoryError$.pipe(untilComponentDestroyed(this))
    .subscribe(err => {
      this.message = err;
      this.loading = false;
    });
   }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  returnPaymentHistory() {
 }

goToTransfers() {
  this.router.navigate(['bills-payments']);
}

  goToPayments() {
    console.log('t');
  }

  repeatPayment(bills) {
    console.log('t');
    this.router.navigate(['payments']);
  }

}
