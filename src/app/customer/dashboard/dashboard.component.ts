import { AfterViewInit, Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserService } from '../../_services/user.service';
// import { TransactionHistory, TransHistResponse } from '../accounts/transaction-history/transaction-history.model';
// import { TransactionHistoryService } from '../accounts/transaction-history/transaction-history.service';
// import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../bills-payment/_model/bills-payment.model';
import { BillsPaymentService } from '../bills-payment/_services/bills-payment.service';
import { style, animate, transition, trigger, state } from '@angular/animations';
import { Router } from '@angular/router';
import { CustomerService } from '../_customer-service/customer.service';
import { AcctDetails } from '../_customer-model/customer.model';
import { UtilitiesService } from '../../_services/utilities.service';
import { CardsService } from '../cards/cards.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss'
  ],
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
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public itemNo: any[];
  public userDetails: any;
  // public transactions: TransactionHistory[];
  public accounts: AcctDetails[];
  public selectedAcct: AcctDetails;
  public categories: Category[];
  public loading = false;
  public error: string;
  public categoryIcons;
  errorMessage: string;
  public currencySymbol = {'NGN': '₦', 'USD': 'USD', 'GBP': 'GBP', 'EURO': 'EUR' };
  options: any = {
    position: ['bottom', 'right'],
  };

  constructor(
    private billsPaymentService: BillsPaymentService,
    private user: UserService,
    private router: Router,
    private customerService: CustomerService,
    private cardsService: CardsService
  ) {
    this.itemNo = [1, 1, 2, 3];
    this.categoryIcons = this.billsPaymentService.categoryIcons;
    // this.customerService.getAcctDetailsData();
    this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe( accts => this.accounts = accts);
    setTimeout(() => {
      // this.customerService.getAcctDetailsData();
      this.userDetails = this.user.getUserDetails();
      this.cardsService.getCardProtectStatusData();
      this.billsPaymentService.categories$.pipe(untilComponentDestroyed(this))
      .subscribe(categories => this.categories = categories);
      this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
      .subscribe(selected => this.selectedAcct = selected);
    }, 5000);

  }

  ngOnInit() {
    // this.customerService.getAcctDetailsData();
  //   const count = 0;
  //   if (!localStorage.getItem('reloaded')) {
  //     location.reload(true);
  //     localStorage.setItem('reloaded', 'true');
  //  }
  }

  ngOnDestroy(): void {
    // localStorage.removeItem('reloaded');
   }

  onClick(category: Category) {
    console.log('category selected' + JSON.stringify(category)); // Delete later
    this.router.navigate(['payments/categories', category]);
    this.billsPaymentService.updateSelectedCategory(category);
  }

  ngAfterViewInit() {
    this.customerService.getAcctDetailsData();

  }

}
