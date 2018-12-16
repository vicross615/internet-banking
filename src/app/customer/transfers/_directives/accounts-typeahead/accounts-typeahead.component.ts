import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { AcctToDebit } from '../../../_customer-model/customer.model';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { CustomerService } from '../../../_customer-service/customer.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-accounts-typeahead',
  templateUrl: './accounts-typeahead.component.html',
  styleUrls: ['./accounts-typeahead.component.scss'],
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
    ])
  ]
})
export class AccountsTypeaheadComponent implements OnInit, OnDestroy {
  public accts: Array<AcctToDebit> = [];
  acctInput = new FormControl('');
  public acctModel: any;
  public currencySymbol = {'NGN': '₦', 'USD': 'USD', 'GBP': 'GBP', 'EURO': 'EUR' };
  @Output() acctToDebitEvent = new EventEmitter<AcctToDebit>();
  @Input() label: string;

  @ViewChild('acctsInstance') acctsInstance: NgbTypeahead;
  acctFocus$ = new Subject<string>();
  acctClick$ = new Subject<string>();

  constructor(
    private cp: CurrencyPipe,
    private customerService: CustomerService,
  ) {
    this.customerService.acctToDebit$
    .pipe(untilComponentDestroyed(this)).subscribe(
      accts => this.accts = accts
    );
   }

   ngOnDestroy(): void {

   }

   // this function initiates the search logic that displays list of accounts for account to Debit
  acctsTypeahead = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.acctClick$.pipe(filter(() => !this.acctsInstance.isPopupOpen()));
    const inputFocus$ = this.acctFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.accts
      : this.accts.filter(v => v.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 5))
  );
  }

  formatter = (
    x: {
      accountName: string, nuban: string, accountBalance: string
    }
  ) => x.accountName + ' - ' + x.nuban + ' - ' + this.cp.transform(x.accountBalance, '₦')

  ngOnInit() {
    // this.acctModel = this.accts[0];
  }

  compareAccts() {
    setTimeout(() => {
      console.log(this.acctModel);
    }, 300);
  }

  onAcctChange() {
    setTimeout(() => {
      console.log('event: ' + JSON.stringify(this.acctModel));
      this.acctToDebitEvent.emit(this.acctModel);
    }, 300);
  }

  clear() {
    this.acctInput.setValue('');
    this.acctModel = null;
  }

}
