import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged, debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { Subject , Observable, merge, Subscription } from 'rxjs';
import { TransferService } from '../_services/transfer.service';
import { CustomerService } from '../../_customer-service/customer.service';
import { PreRegBeneficiaries, AcctToDebit } from '../../_customer-model/customer.model';
import { CurrencyPipe } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { UtilitiesService } from '../../../_services/utilities.service';

@Component({
  selector: 'app-pre-registered',
  templateUrl: './pre-registered.component.html',
  styleUrls: ['./pre-registered.component.scss'],
    encapsulation: ViewEncapsulation.None,
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
export class PreRegisteredComponent implements OnInit, OnDestroy {
  public preRegTransferForm: FormGroup;
  public acctToDebit: Array<any> = [];
  public preRegBeneficiaries: Array<PreRegBeneficiaries> = [];
  preRegBeneficiariesError: string;
  public preRegBeneficiariesModel: string;
  transferLimit = 0.00;
  successMessage = '';
  errorMessage = '';
  isLoading: boolean;
  public accountToDebit: AcctToDebit = null;
  public formSubmit = false;
  public reqBody: Object;
  public config: any;
  subscription: Subscription;

  @ViewChild('preRegBeneficiariesInstance') preRegBeneficiariesInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    private cp: CurrencyPipe,
    public util: UtilitiesService
  ) {
    this.customerService.getPreRegBeneficiariesData();
    this.subscription = this.customerService.preRegBeneficiaries$
    .subscribe(
      preReg => this.preRegBeneficiaries = preReg
    );
    this.customerService.preRegBeneficiariesError$
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      err => this.preRegBeneficiariesError = err
    );
    setTimeout(() => {
      console.log('prereg: ' + JSON.stringify(this.preRegBeneficiaries));
    }, 2000);
    this.createPreRegTransferForm();
    this.returnTransferLimit();
   }

  // ccount to Debit event handler that gets account to debit from child component
  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.preRegTransferForm.controls['acctToDebit'].patchValue($event);
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createPreRegTransferForm();
      // this.preRegTransferForm.reset();
      this.preRegBeneficiariesModel = '';
    }
  }

  // this function initiates the search logic that displays list of accounts for account to Debit
  PreRegBeneficiaries = (text$: Observable<string>) => {
    const debounceText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clickWithClosedPopup$ = this.click$.pipe(filter(() => !this.preRegBeneficiariesInstance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debounceText$, inputFocus$, clickWithClosedPopup$).pipe(
      map(term => (term === '' ? this.preRegBeneficiaries
      : this.preRegBeneficiaries.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1))
      .slice(0, 10))
    );
  }

preRegformatter = (
  x: {
    beneficiaryName: string, accountNumber: string, ledgerDescription: string
  }
) => x.beneficiaryName

setPreRegBeneficiariesModel(e: NgbTypeaheadSelectItemEvent) {
    this.preRegBeneficiariesModel = e.item.beneficiaryName + ' -(' + e.item.accountNumber + ') ';

}


  ngOnInit() {
    this.customerService.getPreRegBeneficiariesData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Method that ruturns transfer limit
  public returnTransferLimit() {
    this.transferService.getTransferLimit()
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.transferLimit = Number(res.remainingLimit);
          } else {
            alert('Accounts Balance: ' + res.responseDescription + '. You are viewing ofline data');
          }
      },
      err => {
        console.error('Session is expired, please Login');
        console.log(err);
      }
    );
  }

  openTokenConfirmation() {
    this.reqBody = {
      'accountToDebit': this.preRegTransferForm.value.acctToDebit.nuban,
      'accountToCredit': this.preRegTransferForm.value.preRegBeneficiary.accountNumber,
      'beneName': this.preRegTransferForm.value.preRegBeneficiary.beneficiaryName,
      'amount': this.preRegTransferForm.value.transferAmt.replace(',', ''),
      'type': 5,
      'requestType': 'TRANSFER',
      'purpose': 'Pre-registered Intra-Transfer',
      'secretAnswer': this.preRegTransferForm.value.secretAnsw,
      'remark': this.preRegTransferForm.value.remark
    };
    this.formSubmit = true;
    console.log(this.reqBody);
  }

  createPreRegTransferForm() {
    this.preRegTransferForm = this.fb.group({
      'acctToDebit': ['', Validators.required],
      'preRegBeneficiary': ['', Validators.required],
      'transferAmt': ['', Validators.required],
      'remark': '',
      'secretAnsw': ['', Validators.required]
    });
  }

  clearBeneficiary() {
    this.preRegTransferForm.controls['preRegBeneficiary'].patchValue('');
    this.preRegBeneficiariesModel = '';
    this.successMessage = '';
  }

}
