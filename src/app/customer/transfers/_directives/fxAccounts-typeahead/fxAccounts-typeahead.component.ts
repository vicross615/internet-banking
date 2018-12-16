import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { AcctToDebitFX } from '../../../_customer-model/customer.model';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { CustomerService } from '../../../_customer-service/customer.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-fxaccounts-typeahead',
  templateUrl: './fxAccounts-typeahead.component.html',
  styleUrls: ['./fxAccounts-typeahead.component.scss'],
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
export class FxAccountsTypeaheadComponent implements OnInit, OnDestroy {
  public fxaccts: Array<AcctToDebitFX> = [];
  public currencySymbol = {'USD': '$', 'GBP': '£', 'EUR': '€', };
  public fxacctModel: AcctToDebitFX;
  @Output() fxacctToDebitEvent = new EventEmitter<AcctToDebitFX>();
  @Input() label: string;

  @ViewChild('fxacctsInstance') fxacctsInstance: NgbTypeahead;
  fxacctFocus$ = new Subject<string>();
  fxacctClick$ = new Subject<string>();

  constructor(
    private customerService: CustomerService,
    private currencyPipe: CurrencyPipe
  ) {
    this.customerService.acctToDebitFX$
    .pipe(untilComponentDestroyed(this)).subscribe(
      fxaccts => this.fxaccts = fxaccts
    );
    console.log(this.fxaccts);
   }

   ngOnDestroy(): void {

   }

   // this function initiates the search logic that displays list of accounts for account to Debit
  fxacctsTypeahead = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.fxacctClick$.pipe(filter(() => !this.fxacctsInstance.isPopupOpen()));
    const inputFocus$ = this.fxacctFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.fxaccts
      : this.fxaccts.filter(v => v.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  );
  }

  fxformatter = (
    x: {
      accountName: string, nuban: string, accountBalance: string, currencyCode: string
    }
  ) => x.accountName + ' - ' + x.nuban + '-' + this.currencyPipe.transform(x.accountBalance, x.currencyCode, 'symbol')

  ngOnInit() {
  }

  onFxAcctChange () {
    setTimeout(() => {
      console.log('event: ' + JSON.stringify(this.fxacctModel));
      this.fxacctToDebitEvent.emit(this.fxacctModel);
    }, 300);
  }

}
