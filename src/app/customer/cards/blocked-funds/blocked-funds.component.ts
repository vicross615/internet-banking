import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardsService } from '../cards.service';
import { CustomerService } from '../../_customer-service/customer.service';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { transition, animate, style, trigger, state } from '@angular/animations';
import { UtilitiesService } from '../../../_services/utilities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockedFunds } from '../cards.model';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-blocked-funds',
  templateUrl: './blocked-funds.component.html',
  styleUrls: ['./blocked-funds.component.scss'],
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
export class BlockedFundsComponent implements OnInit, OnDestroy {
  blockedFunds: BlockedFunds[];
  accounts: any[];
  selectedAccount: any;
  isLoading: boolean;
  errorMessage: string;
  public config: any;

  constructor(
    private cardsService: CardsService,
    private customerService: CustomerService,
    private util: UtilitiesService
  ) {
    this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(accts => this.accounts = accts);
    this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(s => this.selectedAccount = s);
   }

  ngOnInit() {
    setTimeout(() => {
      this.showBlockedFunds(this.selectedAccount.map_acc_no);
    }, 1000);

  }

  ngOnDestroy(): void {

  }

  refresh(acct) {
    console.log('refresh');
  }

  showBlockedFunds(acct) {
    const reqBody = {
      'acct': acct,
      'type': '0'
    };
    this.cardsService.getBlockedFunds(reqBody)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.isLoading = false;
          this.blockedFunds = res.ListOfBlocks;
        } else {
          this.isLoading = false;
          this.errorMessage = this.util.handleResponseError(res);
        }
      },
      (error: any) => {
        this.errorMessage = JSON.stringify(error);
      }
    );
  }

}
