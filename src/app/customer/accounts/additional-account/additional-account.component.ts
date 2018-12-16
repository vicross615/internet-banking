import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { AccountsService } from '../_services/accounts.service';
import { UtilitiesService } from '../../../_services/utilities.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-account',
  templateUrl: './additional-account.component.html',
  styleUrls: ['./additional-account.component.scss'],
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
export class AdditionalAccountComponent implements OnInit {
  additionalaccountForm: FormGroup;
  public accountToDebit: AcctToDebit = null;
  reasons: Array<Object>;
  isLoading: boolean;
  selectedAccount: any;
  errorMessage: string = null;
  isSuccess: boolean;
  public formSubmit = false;
  form: any; // holds ngForm values
  message: any = null;
  activeService = 'Additional Account Opening';
  AccountOpeningObject: AdditionalAccountOpening = {
    fullAccountKey: null,
    nuban: null,
    email: null
  };
  // Hard coded account Type, Whether savings or Current
  account_Type: any = [
    {
      Id: '59',
      desc: 'Savings Account'
    },
    { Id: '1', desc: 'Current Account' }
  ];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountsService,
    private util: UtilitiesService
  ) {
    this.reasons = [
      { Id: '', desc: 'Select Reason' },
      { Id: 'Suspected Fraud', desc: 'Suspected Fraud' },
      { Id: 'Lost Card', desc: 'Lost Card' },
      { Id: 'Upgrade to Platinum', desc: 'Upgrade to Platinum' },
      { Id: 'Stolen Card', desc: 'Stolen Card' }
    ];
  }

  optionSelected(option) {
    this.selectedAccount = option;
    this.additionalaccountForm.controls['acct'].patchValue(option);
  }

  ngOnInit() {
    this.AdditionalAccountForm();
    this.optionSelected(this.account_Type[0]);
  }

  AdditionalAccountForm() {
    this.additionalaccountForm = this.fb.group({
      acct: ['', Validators.required],
      secretAnsw: ['', Validators.required],
    });
  }
  onSubmit(form) {
    this.isLoading = true;
    if (this.additionalaccountForm.valid) {
      this.accountService
        .addAccount(form.value)
        .toPromise()
        .then(response => {
          if (response.responseCode === '00') {
            const msg = response.responseDescription;
            this.isSuccess = true;
            this.message = msg.slice(msg.indexOf('-') + 1);
            this.isLoading = false;
            this.AccountOpeningObject = {
              fullAccountKey: response.domAccountResponse.fullAccountKey,
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
    this.errorMessage = this.util.handleResponseError(
      'Check Declaration Before Submiting'
    );
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
export interface AdditionalAccountOpening {
  fullAccountKey: any;
  nuban: string;
  email: string;
}
