import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AccountsService } from '../_services/accounts.service';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { UtilitiesService } from '../../../_services/utilities.service';
import { UserService } from '../../../_services/user.service';
import { Subscriber } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-open-dom-account',
  templateUrl: './open-dom-account.component.html',
  styleUrls: ['./open-dom-account.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class OpenDomAccountComponent implements OnInit, OnDestroy {
  openDomAcctForm: FormGroup;
  selectedCurrency: any;
  SuccessMessage: any = null;
  isLoading: boolean;
  currentUser: any;
  declarationStatus = false;
  errorMessage: string;
  currencies: Array<CurrencyObject> = [];
  public accountFrom: AcctToDebit = null;
  public formSubmit = false;
  isSuccess: boolean;
  form: any; // holds ngForm values
  message: any = null;
  activeService = 'Dom Account Opening';
  AccountOpeningObject: DomAccountOpening = {
    fullAccountKey: null,
    nuban: null,
    email: null
  };

  @ViewChild('input')
  private checkInput;

  constructor(
    private fb: FormBuilder,
    private acctService: AccountsService,
    private util: UtilitiesService,
    private userService: UserService
  ) {
    this.currentUser = this.userService.getUserDetails();
  }
  optionSelected(option) {
    this.selectedCurrency = option;
    this.openDomAcctForm.controls['currency'].patchValue(option);
  }
  ngOnInit() {
    this.createOpenDomAcctForm();
    this.Currencies();
  }
  ngOnDestroy(): void {

  }
  acctToDebitEventHandler($event: any) {
    this.accountFrom = $event;
    this.openDomAcctForm.controls['acctFrom'].patchValue($event);
  }
  checkDeclaration() {
    this.checkInput.nativeElement.checked
      ? (this.declarationStatus = true)
      : (this.declarationStatus = false);
  }
  // Function to get Currency and Currency Code.
  Currencies() {
    this.acctService
      .currencyNameCode()
      .toPromise()
      .then((response: CurrencyResponseObject) => {
        const valid_Currencies = [2, 3, 46];
        for (let i = 0; i < response.currname_code.length; i++) {
          if (valid_Currencies.includes(response.currname_code[i].code)) {
            const data: CurrencyObject = {
              code: response.currname_code[i].code,
              name: response.currname_code[i].name
            };
            this.currencies.push(data);
            this.selectedCurrency = this.currencies[0];
            this.openDomAcctForm.controls['currency'].patchValue(
              this.selectedCurrency
            );
          }
        }
      });
  }
  createOpenDomAcctForm() {
    this.openDomAcctForm = this.fb.group({
      secretAnswer: ['', Validators.required],
      currency: ['', Validators.required]
    });
  }
  // Form Submit Function
  onSubmit(form) {
    if (this.declarationStatus === true && this.openDomAcctForm.valid) {
      this.isLoading = true;
      this.acctService.openDomAccount(form.value).pipe(untilComponentDestroyed(this))
      .subscribe((response: any) => {
        // Handle response
        if (response.responseCode === '00') {
          this.message = response.responseDescription;
          this.isSuccess = true;
          this.isLoading = false;
          // Return the Account details
          this.AccountOpeningObject = {
            fullAccountKey: response.domAccountResponse.fullAccountkey,
            nuban: response.domAccountResponse.nuban,
            email: response.domAccountResponse.email
          };
        } else {
          // if error this occures
          this.isLoading = false;
          const msg = this.util.handleResponseError(response).replace('|', '<br>');
          this.message = msg.replace('|', '<br>').replace('|', '<br>');
        }
      });
      return;
    } // this only runs if there is an error.
    this.errorMessage = 'Check Declaration Before Submiting';
  }

  // Method that opens the Token confirmation modal
  openTokenConfirmation(form: NgForm) {
    this.form = form;
    this.formSubmit = true;
  }
  inititateService($event) {
    this.onSubmit(this.form);
  }
  clearError() {
    this.isSuccess = null;
    this.message = null;
    this.isLoading = false;
    this.formSubmit = false;
  }
}
export interface CurrencyObject {
  code: number;
  name: string;
}
export interface CurrencyResponseObject {
  currname_code: [
    {
      code: number;
      name: string;
    }
  ];
}
export interface DomAccountOpening {
  fullAccountKey: any;
  nuban: string;
  email: string;
}
