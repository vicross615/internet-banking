import { Component, OnInit, Input, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable ,  Subject } from 'rxjs';
import { Beneficiary, Beneficiaries, Banks, AcctToDebit, Frequency } from '../../_customer-model/customer.model';
import { distinctUntilChanged, debounceTime, merge, filter, map } from 'rxjs/operators';
import { TransferService } from '../_services/transfer.service';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-standing-order',
  templateUrl: './standing-order.component.html',
  styleUrls: ['./standing-order.component.scss'],
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
    ])
  ],
})
export class StandingOrderComponent implements OnInit, OnDestroy {
  public standingOrderForm: FormGroup;
  public acctToDebit: Array<any> = [];
  acctToDebitModel: string;
  public accountToDebit: AcctToDebit = null;
  public frequencies: Array<Frequency> = [];
  selectedFrequency: any;
  siType: any;
  public savedBeneficiaries: Array<Beneficiaries> = [];
  savedBeneficiariesModel: string;
  beneficiaryLabel = 'Enter Beneficiary`s name';
  transferLimit = 0.00;
  successMessage = '';
  errorMessage = '';
  public newBeneficiaryDetail: any;
  public selectedSavedBeneficiaryDetail: Beneficiaries;
  isLoading: boolean;
  loadingBeneficiary: boolean;
  public banks: Array<Banks> = [];
  banksModel: string;
  public selectedBank: Banks;
  public formSubmit: boolean;
  public reqBody: Object;

  @ViewChild('savedBeneficiariesInstance') savedBeneficiariesInstance: NgbTypeahead;
  @ViewChild('banksInstance') banksInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  beneficiaryName: any;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    private util: UtilitiesService,
  ) {
    this.customerService.getBeneficiariesData('GTBThirdParty');
    console.log('bene: ' + this.savedBeneficiaries);
    this.customerService.banks$.pipe(untilComponentDestroyed(this))
    .subscribe(
      banks => this.banks = banks
    );

    this.customerService.beneficiaries$
    .subscribe(
      beneficiaries => this.savedBeneficiaries = beneficiaries
    );
    // console.log('Banks: ' + this.banks);      // delete later;
    this.createStandingOrderForm();

    this.frequencies = [
      {
        code: '1',
        name: 'Daily'
      },
      {
        code: '2',
        name: '7 Days'
      },
      {
        code: '3',
        name: 'Bi-Weekly'
      },
      {
        code: '4',
        name: '30 Days'
      },
      {
        code: '5',
        name: '3 Months'
      },
      {
        code: '6',
        name: '6 Months'
      },
      {
        code: '7',
        name: '12 Months'
      },
    ];

    this.siType = this.standingOrderForm.value.SItype;
  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.standingOrderForm.controls['acctToDebit'].patchValue($event);
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createStandingOrderForm();
    }
  }

  changeLabel(label: string) {
    this.beneficiaryLabel = label;
  }

  getBeneficiary(siType) {
    this.customerService.getBeneficiariesData(siType);
    console.log('bene: ' + this.savedBeneficiaries);
    this.customerService.banks$.pipe(untilComponentDestroyed(this))
    .subscribe(
      banks => this.banks = banks
    );
  }

  SavedBeneficiary = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    merge(this.focus$),
    merge(this.click$.pipe(filter(() => !this.savedBeneficiariesInstance.isPopupOpen()))),
    map(
      term => term === null ? []
      : this.savedBeneficiaries
      .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
      .slice(0, 5)
    )
  )

  savedBeneficiariesFormatter = (
    x: {
      name: string, accountNumber: string, bankCode: string, bank: string
    }
  ) => x.name

  setSavedBeneficiariesModel(e: NgbTypeaheadSelectItemEvent) {
    this.savedBeneficiariesModel = e.item.name + ' -(' + e.item.accountNumber + ') ' + e.item.bank;
}

Banks = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    merge(this.focus$),
    merge(this.click$.pipe(filter(() => !this.banksInstance.isPopupOpen()))),
    map(
      term => term === null ? []
      : this.banks
      .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
      .slice(0, 5)
    )
  )

  banksFormatter = (
    x: {
      name: string, code: string, bankShortName: string
    }
  ) => x.name

  setBanksModel(e: NgbTypeaheadSelectItemEvent) {
    this.banksModel = e.item.name;
  }

  ngOnInit() {
    setTimeout(() => {
      this.customerService.beneficiaries$
      .subscribe(
        beneficiaries => this.savedBeneficiaries = beneficiaries
      );
    }, 2000);

    this.selectedFrequency = this.frequencies[0];

  }

  ngOnDestroy(): void {

  }

  public onkey(nuban: string, bank: Banks) {
    let bankCode = '';
    if (nuban.length === 10 && (this.standingOrderForm.value.bank || this.standingOrderForm.value.SItype === 'gtSI')) {
      this.errorMessage = '';
      console.log('bankcode: ' + bank.code);
      if (this.standingOrderForm.value.SItype === 'gtSI') {
        bankCode = '058';
      }
      else {
        bankCode = bank.code;
      }

      this.customerService.getBeneficiary(nuban, bankCode)
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: Beneficiary) => {
            console.log(res);
            if (res.responseCode === '00') {
              // this.otherBanksTransferForm.controls['newBeneficiary'].patchValue(res.accountName);
              this.newBeneficiaryDetail = res;
              console.log('Beneficiary Details' + JSON.stringify(this.newBeneficiaryDetail));
              this.errorMessage = '';
            } else {
              this.errorMessage = `Unable to verify ${nuban}. Check that account number and bank selected are correct`;
              this.successMessage = '';
            }
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
        }
      );
    } else if (nuban.length > 10) {
      this.successMessage = '';
      this.errorMessage = 'nuban entered is greater than 10 digit';
    } else {
      this.successMessage = '';
      this.errorMessage = 'Enter 10 digit NUBAN';
    }

  }

  // Method that opens the Token confirmation modal
  openTokenConfirmationModal() {
    let beneficiaryName = '';
    let beneficiaryAcctNo = '';
    let beneficiaryBankCode = '';
    if (this.standingOrderForm.value.beneficiaryOption === 'SAVED') {
      beneficiaryName = this.standingOrderForm.value.savedBeneficiary.name;
      beneficiaryAcctNo = this.standingOrderForm.value.savedBeneficiary.accountNumber;
      beneficiaryBankCode = this.standingOrderForm.value.savedBeneficiary.bankCode;
    } else {
      beneficiaryName = this.newBeneficiaryDetail.accountName;
      beneficiaryAcctNo = this.newBeneficiaryDetail.nuban;
      beneficiaryBankCode = this.standingOrderForm.value.bank.code;
    }

    console.log(this.standingOrderForm.value.SItype);
    

    this.reqBody = {
      'pFreq': this.standingOrderForm.value.frequency,
      'p1stPayDate': this.util.formatDate(this.standingOrderForm.value.startDate),
      'pLastPayDate': this.util.formatDate(this.standingOrderForm.value.endDate),
      'amount': JSON.stringify(this.standingOrderForm.value.transferAmt),
      'AccountToCredit': beneficiaryAcctNo,
      'pRemarks': this.standingOrderForm.value.pRemarks,
      'AccountToDebit': this.standingOrderForm.value.acctToDebit.nuban,
      'bankCode': beneficiaryBankCode,
      'destinationAccName': beneficiaryName,
      'sourceAccName': this.standingOrderForm.value.acctToDebit.accountName,
      'secretAnswer': this.standingOrderForm.value.secretAnsw,
    };
    this.formSubmit = true;
    console.log(this.reqBody);
  }

  createStandingOrderForm() {
    this.standingOrderForm = this.fb.group({
      'acctToDebit': ['', Validators.required],
      'beneficiaryOption': ['SAVED', Validators.required],
      'newBeneficiary': '',
      'savedBeneficiary': '',
      'bank': '',
      'transferAmt': ['', Validators.required],
      'frequency': ['', Validators.required],
      'startDate': ['', Validators.required],
      'endDate': ['', Validators.required],
      'pRemarks': '',
      'SItype': ['gtSI', Validators.required],
      'secretAnsw': ['', Validators.required]
    });
  }

  clearBeneficiary() {
    this.standingOrderForm.controls['savedBeneficiary'].patchValue('');
    this.standingOrderForm.controls['newBeneficiary'].patchValue('');
    this.standingOrderForm.controls['bank'].patchValue('');
    this.newBeneficiaryDetail = '';
    console.log(this.newBeneficiaryDetail);
    /* {
      accountName: '',
      nuban: '',
      oldAccountNo: '',
      requestId: '',
      responseCode: '',
      responseDescription: ''
    }; */
    this.successMessage = '';
  }

  savedBeneficiary() {}

}
