import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { trigger, transition, style, animate } from '@angular/animations';
import { CustomerService } from '../../_customer-service/customer.service';
import { AcctDetails } from '../../_customer-model/customer.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'acct-details',
  templateUrl: './acct-details.component.html',
  styleUrls: ['./acct-details.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ],
})

export class AcctDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  // input property for carousel. The value determines the number items to be displayed wrt screen size
  @Input() itemNo: any[];

  public accounts: AcctDetails[];
  public currencySymbol = {'NGN': '₦', 'USD': 'USD', 'GBP': 'GBP', 'EUR': 'EUR' };
  public selectedAcct: AcctDetails;
  public acctBalanceCarouselItems: Array<any> = [];
  public acctBalanceCarousel: NgxCarousel;
  public errorMessage: string;
  private unsubscribe$ = new Subject();


  constructor(
    private customerService: CustomerService
  ) {
    // this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
    // .subscribe(accts => this.accounts = accts);
   }

   ngOnDestroy(): void {

   }

  ngOnInit() {
    console.log('accounts Enquiry: ' + this.accounts);
    setTimeout(() => {
      this.customerService.getAcctDetailsData();
      // this.customerService.updateSelectedAcctDetails(null);
      // this.customerService.updateAcctDetails([]);
      this.customerService.acctDetailError$.subscribe(err => this.errorMessage = err);
      this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
      .subscribe(accts => {
        this.accounts = accts;
        console.log(this.accounts);
      });
      this.acctBalanceCarouselLoad(this.accounts);
      this.initiateCarousel();
    }, 5000);
  }

  initiateCarousel() {
    this.acctBalanceCarousel = {
      grid: { xs: this.itemNo[0], sm: this.itemNo[1], md: this.itemNo[2], lg: this.itemNo[3], all: 0 },
      speed: 600,
      interval: 3000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding-top: 0.12rem;
            padding-bottom: 1.2rem;
            margin-top:-30px;
            white-space: nowrap;
            overflow: auto;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            background: #6b6b6b;
            padding: 0.2rem;
            margin: 0 2px;
            transition: .4s;
          }
          .ngxcarouselPoint li.active {
              transform: scale(1.09);
              background: #dd4f05;
            }
        `
      },
      loop: false,
      touch: true,
      easing: 'ease',
      animation: 'lazy'
    };
  }

  retry() {
    this.customerService.getAcctDetailsData();
    this.acctBalanceCarouselLoad(this.accounts);
  }

  acctBalanceCarouselLoad(accounts: AcctDetails[]) {
    console.log(accounts);
    const len = this.acctBalanceCarouselItems.length;
    if (len <= (accounts.length - 1)) {
      for (let i = len; i < len + accounts.length; i++) {
        console.log('available Balance' + accounts[i].crnt_bal);
        console.log('book Balance' + accounts[i].avail_bal);
        this.acctBalanceCarouselItems.push(
          accounts[i]
        );
        console.log('accounts carousel' + this.acctBalanceCarouselItems);
      }
    }
  }

  public onAcctClick(clickedAcct) {
   console.log('account was clicked');
   console.log(clickedAcct);

  }

  ngAfterViewInit() {
    this.customerService.getAcctDetailsData();
    // setTimeout(() => {
    //   location.reload();
    // }, 10000000);

  }

}


