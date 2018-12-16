import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Cards } from '../cards.model';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { AcctToDebit, AcctToDebitFX } from '../../_customer-model/customer.model';
import { Modal } from '../../transfers/transfer-message-modal/modal.model';
import { CustomerService } from '../../_customer-service/customer.service';
import { CardsService } from '../cards.service';
import { UtilitiesService } from '../../../_services/utilities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsService } from '../../accounts/_services/accounts.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { FxService } from '../../fx/fx.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge} from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-replacement',
  templateUrl: './card-replacement.component.html',
  styleUrls: ['./card-replacement.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CardReplacementComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public selectedCardReplacement: any = null;
  public cards: Array<Cards> = [];
  public cardReplacementForm: FormGroup;
  public accountToDebit: AcctToDebit = null;
  public accountToLink: AcctToDebit = null;
  public branches: Array<BankBranches> = [];
  public formSubmit: boolean;
  currentUser: string = JSON.parse(localStorage.getItem('userDetails'));
  declarationStatus = false;
  // tslint:disable-next-line:no-inferrable-types
  reqType_is_replacement: boolean = true;
  reasons: Array<Reason> = [];
  cardCharges: any = 1000.0;
  modal: Modal = new Modal();
  isSuccess: any;
  form: any; // holds ngForm values
  message: any = null;
  dollarAccounts: Array<AccountToDebitModel> = []; // Used for dollar account to debit.

  @ViewChild('input')
  private checkInput;
  isLoading: boolean;
  selectedCardRequest: any = null;
  // tslint:disable-next-line:no-inferrable-types
  isVirtualCard: boolean;
  isDollarCard: boolean;

  @ViewChild('dollaracctsInstance') dollaracctsInstance: NgbTypeahead;
  dollaracctFocus$ = new Subject<string>();
  dollaracctClick$ = new Subject<string>();

  public dollaraccts: Array<AcctToDebitFX> = [];
  public currencySymbol = {'NGN': '₦', 'USD': '$', 'GBP': '£', 'EUR': '€', };

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private accountsService: AccountsService,
    private util: UtilitiesService,
    private cardsService: CardsService,
    private fxService: FxService,
    private currencyPipe: CurrencyPipe
  ) {
    this.cardsService.getCardStatusData();
  }

  // Hard coded form data
  pickUp_Options = [{ Info: 'Self' }, { Info: 'Courier' }];
  // hard coded values for reasons
  hardcodedReasons = [
    { Id: '', desc: 'Select Reason' },
    { Id: 'SUSPECTED FRAUD', desc: 'Suspected Fraud' },
    { Id: 'LOST CARD', desc: 'Lost Card' },
    { Id: 'UPGRADE TO PLATINUM', desc: 'Upgrade to Platinum' },
    { Id: 'STOLEN CARD', desc: 'Stolen Card' }
  ];
  // hard coded values for card type
  cardReplacementTypes = [
    {
      name: 'MasterCard Naira Debit',
      code: '02'
    },
    {
      name: 'Naira MasterCard Platinum',
      code: '08'
    }
  ];
  cardRequestTypes = [
    {
      name: 'MasterCard Dollar Debit',
      code: '00'
    },
    {
      name: 'Virtual Prepaid Card',
      code: '37'
    }
  ];
  // Initialize Form
  async ngOnInit() {
    this.createCardReplacementForm();
    this.isVirtualCard = false;
    await this.cardsService.cards$
      .pipe(untilComponentDestroyed(this))
      .subscribe(cards => {
        this.cards = cards;
        this.selectedCardReplacement = cards[0];
        this.cardReplacementForm.controls['card_Number'].patchValue(
          this.selectedCardReplacement
        );
      });
    await this.customerService.getBranchesData();
    this.bankBranches();
    this.Reasons();
    this.getDollarAccounts();
  }
  ngAfterViewInit() {
    this.selectedCardRequest = this.cardRequestTypes[0];
  }

  ngOnDestroy(): void {}

  getDollarAccounts() {
    this.fxService
      .acctTodebitForChargeFX(2)
      .pipe(untilComponentDestroyed(this))
      .subscribe((response: any) => {
        console.log(response);
        const accounts = response.acct;
        accounts.forEach(accts => {
          this.dollarAccounts.push(accts);
        });
      });
    console.log(this.dollarAccounts);
  }
  // form toggle
  get replacementType() {
    this.cardReplacementForm.reset();
    this.createCardReplacementForm();
    this.reqType_is_replacement = true;
    this.selectedCardReplacement = this.cardReplacementTypes[0];
    this.cardReplacementForm.controls['card_Number'].patchValue(
      this.selectedCardReplacement
    );
    this.isVirtualCard = false;
    this.isDollarCard = false;
    return;
  }
  get requestType() {
    this.cardReplacementForm.reset();
    this.createCardReplacementForm();
    this.reqType_is_replacement = false;
    // Set default value for request template
    this.selectedCardRequest = this.cardRequestTypes[0];
    this.cardReplacementForm.controls['card_Number'].patchValue(
      this.selectedCardRequest
    );
    // Control view for selected template default, which is dollar card
    this.requestedDollarCard = this.selectedCardRequest.code;
    return;
  }

  FXacctToDebitEventHander($event: any) {
    this.cardReplacementForm.controls['acctToDebit'].patchValue($event);
  }

  Reasons() {
    for (let i = 0; i < this.hardcodedReasons.length; i++) {
      const reasons: Reason = {
        Id: this.hardcodedReasons[i].Id,
        desc: this.hardcodedReasons[i].desc
      };
      this.reasons.push(reasons);
    }
  }
  createCardReplacementForm() {
    this.cardReplacementForm = this.fb.group({
      card_Number: [''],
      acctToDebit: [''],
      acctToLink: [''],
      reason: [''],
      token: [''],
      reqtype: ['1'],
      secretAnsw: [''],
      pickup_branch: [''],
      testQuestion: [''],
      testAnswer: ['']
    });
  }
  bankBranches() {
    this.customerService.branchesObserver
      .pipe(untilComponentDestroyed(this))
      .subscribe(branches => {
        for (let i = 0; i < branches.length; i++) {
          const data: BankBranches = {
            name: branches[i].name,
            code: branches[i].code,
            address: branches[i].address
          };
          this.branches.push(data);
        }
      });
  }
  acctToDebitEventHandler($event: any) {
    this.accountToDebit = $event;
    this.cardReplacementForm.controls['acctToDebit'].patchValue($event);
  }
  acctToLinkEventHandler($event: any) {
    this.accountToLink = $event;
    this.cardReplacementForm.controls['acctToLink'].patchValue($event);
  }
  checkDeclaration() {
    this.checkInput.nativeElement.checked
      ? (this.declarationStatus = true)
      : (this.declarationStatus = false);
  }
  // Used to control the view
  set requestedVirtualCard(Code: string) {
    Code === '37' ? (this.isVirtualCard = true) : (this.isVirtualCard = false);
  }
  set requestedDollarCard(Code: string) {
    Code === '00' ? (this.isDollarCard = true) : (this.isDollarCard = false);
  }
  set updateSelectedCard(card) {
    this.cardReplacementForm.reset();
    this.selectedCardReplacement = card;
    this.cardReplacementForm.controls['card_Number'].patchValue(
      this.selectedCardReplacement
    );
    this.cardReplacementForm.controls['reqtype'].patchValue('1');
  }
  set updateSelectedCardRequest(card) {
    this.selectedCardRequest = card;
    // check assessor to control the view dynamically
    this.requestedVirtualCard = this.selectedCardRequest.code;
    this.requestedDollarCard = this.selectedCardRequest.code;
    this.cardReplacementForm.controls['card_Number'].patchValue(
      this.selectedCardRequest
    );
    this.cardReplacementForm.controls['reqtype'].patchValue('0');
  }
  resetFormEventHandler($event) {
    if ($event === true) {
      this.createCardReplacementForm();
    }
  }
  OnSubmit(form) {
    if (this.cardReplacementForm.valid) {
      this.isLoading = true;
      this.cardsService
        .cardRequest(form.value)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          response => {
            console.log(response);
            if (response && response.responseCode === '00') {
              this.isLoading = false;
              this.isSuccess = true;
              this.message = response.responseDescription;
              this.cardReplacementForm.reset();
              this.ngOnInit();
            } else {
              this.isLoading = false;
              this.message =
                this.util.handleResponseError(response) ||
                'Something went wrong!';
            }
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.message = error;
            this.isLoading = false;
          }
        );
    } else {
      this.isLoading = false;
      alert('Please Complete the Form');
      // Show invalid fields and console.log
      const invalidFields = this.util.findInvalidControls(
        this.cardReplacementForm
      );
      console.log(invalidFields); // For dubugging purposes
      this.message = 'You have some missing or invalid form inputs';
      return;
    }
  }
  // Method that opens the Token confirmation modal
  openTokenConfirmation(form: NgForm) {
    this.form = form;
    this.formSubmit = true;
  }
  inititateService($event) {
    this.cardReplacementForm.controls['token'].patchValue($event);
    this.OnSubmit(this.form);
  }
  clearError() {
    this.isSuccess = null;
    this.message = null;
    this.isLoading = false;
    this.formSubmit = false;
  }
   // this function initiates the search logic that displays list of accounts for account to Debit
   fxacctsTypeahead = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.dollaracctClick$.pipe(filter(() => !this.dollaracctsInstance.isPopupOpen()));
    const inputFocus$ = this.dollaracctFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.dollarAccounts
      : this.dollarAccounts.filter(v => v.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  );
  }

  dollarformatter = (
    x: {
      accountName: string, nuban: string, accountBalance: string, currencyCode: string
    }
  ) => x.accountName + ' - ' + x.nuban + '-' + this.currencyPipe.transform(x.accountBalance, x.currencyCode, 'symbol')

}
export interface BankBranches {
  name: string;
  code: string;
  address: string;
}
export interface Reason {
  Id: any;
  desc: any;
}
export interface AccountToDebitModel {
  accountBalance: any;
  accountName: any;
  accountType: any;
  fullAcctKey: any;
  nuban: any;
}
