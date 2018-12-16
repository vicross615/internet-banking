import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable,  Subject} from 'rxjs';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Beneficiary, Beneficiaries, AcctToDebit, AcctToDebitFX, Purpose } from '../../_customer-model/customer.model';
import { CustomerService } from '../../_customer-service/customer.service';
import { distinctUntilChanged, filter, map, debounceTime, merge} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, formatDate, DatePipe } from '@angular/common';
import { TransferService } from '../../transfers/_services/transfer.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { UtilitiesService } from '../../../_services/utilities.service';

@Component({
  selector: 'app-gtb-fx',
  templateUrl: './gtb-fx.component.html',
  styleUrls: ['./gtb-fx.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // Animation
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
export class GtbFxComponent implements OnInit, OnDestroy {
  today = new Date();
  public gtbFxTransferForm: FormGroup;
  public acctToDebit: Array<any> = [];
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
  public acctToDebitFX: AcctToDebitFX;
  public formSubmit = false;
  public reqBody: Object;
  public fxPayBody: Array<any>;
  beneficiaryMessage: string;
  showErrorMessage = false;
  paymentpurpose: Purpose;
  private checkInput;
  declarationStatus: boolean;
  formatedDate: any;
  customerAcctArray: Array<any>;
  currency: any;

  @ViewChild('savedBeneficiariesInstance') savedBeneficiariesInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
   constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    public util: UtilitiesService,
    private dp: DatePipe
  ) {

    this.customerService.getBeneficiariesData('GTBDomThirdParty');
    this.customerService.beneficiaries$
    .subscribe(
      beneficiaries => this.savedBeneficiaries = beneficiaries
    );

    this.customerService.GetPurpose()
    .subscribe(
          (res: any) => {
            this.paymentpurpose = res.fxpurp;
          });

    this.formatedDate = dp.transform(this.today, 'shortDate', 'en-US');
    this.formatedDate = formatDate(this.formatedDate, 'yyyy-MM-dd', 'en-US');
    console.log(this.today);
    console.log(this.formatedDate);

    this.createGtbFxTransferForm();
    this.returnTransferLimit();
  }

  clearBen() {
    this.gtbFxTransferForm.controls['savedBeneficiary'].setValue('');
    this.savedBeneficiariesModel = null;
  }

  FXacctToDebitEventHander($event: any) {
    console.log($event);
    this.acctToDebitFX = $event;
    console.log(this.acctToDebitFX);
    console.log('parent: ' + JSON.stringify(this.acctToDebitFX));
    console.log('Done stringfying' + JSON.stringify(this.acctToDebitFX));
    console.log(this.acctToDebitFX.nuban);
    // this.compareAccts();
    this.gtbFxTransferForm.controls['acctToDebitFX'].patchValue($event);
  }

  // purposeEventHander($event: any) {
  //   const code = $event.code;
  //   console.log($event.code);
  //   this.gtbFxTransferForm.controls['paymentpurpose'].setValue($event);
  // }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createGtbFxTransferForm();
    }
  }

  changeLabel(label: string) {
      this.beneficiaryLabel = label;
  }

  // checkDeclaration() {
  //   this.gtbFxTransferForm.value.notice === true
  //     ? (this.declarationStatus = true)
  //     : (this.declarationStatus = false);
  // }

    // this function initiates the search logic that displays list of accounts for account to Debit
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
      .slice(0, 10).filter(v => v.bank === 'GUARANTY TRUST BANK PLC')
    )
  )

  savedBeneficiariesFormatter = (
    x: {
      name: string, accountNumber: string, bankCode: string, bank: string
    }
  ) => x.name
  //  + ' - (' + x.accountNumber + ') - ' + x.bank

  setSavedBeneficiariesModel(e: NgbTypeaheadSelectItemEvent) {
    // this.newBeneficiaryDetail = null;
    this.savedBeneficiariesModel = e.item.name + ' -(' + e.item.accountNumber + ') ' + e.item.bank;
    // this.selectedSavedBeneficiaryDetail = e.item;
}

  ngOnInit() {
    console.log('gtforms');
  }

  ngOnDestroy(): void {

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
            // alert('Accounts Balance: ' + res.responseDescription + '. You are viewing ofline data');
          }
      },
      err => {
        console.error('Session is expired, please Login');
        console.log(err);
      }
    );
  }


  public onkey(nuban: string) {
    if (nuban.length === 10) {
      this.loadingBeneficiary = true;
      this.errorMessage = '';
      this.customerService.getBeneficiary(nuban, '058')
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: Beneficiary) => {
            console.log(res);
            if (res.responseCode === '00') {
              // this.gtTransferForm.controls['newBeneficiary'].patchValue(res.accountName);
              this.newBeneficiaryDetail = res;
              console.log('Beneficiary Details' + JSON.stringify(this.newBeneficiaryDetail));
              this.errorMessage = '';
              this.loadingBeneficiary = false;
            } else {
              this.errorMessage = `Unable to verify ${nuban}. Check that account number is correct`;
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
  openTokenConfirmation() {
    let beneficiaryName = '';
    let beneficiaryAcctNo = '';
    if (this.gtbFxTransferForm.value.beneficiaryOption === 'SAVED') {
      beneficiaryName = this.gtbFxTransferForm.value.savedBeneficiary.name;
      beneficiaryAcctNo = this.gtbFxTransferForm.value.savedBeneficiary.accountNumber;
    } else if (this.gtbFxTransferForm.value.beneficiaryOption === 'NEW') {
      beneficiaryName = this.newBeneficiaryDetail.accountName;
      beneficiaryAcctNo = this.newBeneficiaryDetail.nuban;
    }

    /*
    let customerAcct = this.gtbFxTransferForm.value.acctToDebitFX.fullAcctKey;

    this.customerAcctArray = customerAcct.split("/");
    if (this.customerAcctArray[2] === 2) {
      this.currency = 'USD';
    }
    else if (this.customerAcctArray[2] === 3) {
      this.currency = 'GBP';
    }
    else if (this.customerAcctArray[2] === 46) {
      this.currency = 'EUR';
    }

    console.log(this.currency);
    */


    this.fxPayBody = [
      {
      'amount': this.gtbFxTransferForm.value.transferAmt.replace(',', ''),
      // JSON.stringify(this.gtbFxTransferForm.value.transferAmt),
      // this.gtFXTransferForm.value.transferAmt.replace(',', ''),
      'paymentDate': this.formatedDate,
      'paymentPurpose': this.gtbFxTransferForm.value.paymentpurpose.name,
      'reference': '',
      'remark': this.gtbFxTransferForm.value.remark,
      'offShoreCharge': 'Locally',
      'beneficiaryName': beneficiaryName,
      'beneficiaryAddress': 'Nigeria',
      'beneficiaryBank': 'GTBank',
      'beneficiaryBankAddress': 'Nigeria',
      'beneficiaryCountry': 'Nigeria', // gtFXTransferForm.value.countries.name,
      'beneficiaryCountryCode': '566',
      'beneficiaryAccountNo': beneficiaryAcctNo,
      'beneficiaryBankRoutingNo': '058152052',
      'beneficiaryBankSWIFT': 'GTBINGLA',
      'beneficiaryInstitution': '',
      'intermediaryBankName': '',
      'intermediaryBankAccountNo': '',
      'intermediaryBankRoutingNo': '',
      'intermediaryBankSWIFT': '',
      'intermediaryBenBankAddress': '',
      'send_Ben_Relationship': '',
      'beneficiaryBizNature': '',
      'senderBizNature': '',
      'fundSource': '',
      'isInterbankRequired': 'NO',
      'beneFiciaryOption': this.gtbFxTransferForm.value.beneficiaryOption,
      'repeatTrans': '',
      'thirdParty': '',
      'isBenBankInCanada': '',
      'canadaTransitNo': '',
      'canadaInstName': '',
    }];

    this.reqBody = {
      'actToDebitTrans': this.gtbFxTransferForm.value.acctToDebitFX.fullAcctKey,
      'actToDebitcharge': this.gtbFxTransferForm.value.acctToDebitFX.fullAcctKey,
      'currency': this.gtbFxTransferForm.value.acctToDebitFX.altCurCode,
      'requestType': 'TRANSFER',
      'purpose': 'Fx-Transfer',
      'secretAnswer': this.gtbFxTransferForm.value.secretAnsw,
      'userType': 'USER',
      'TransType': 'GTBDomThirdParty',
      'fxPay': this.fxPayBody,
      'amount': this.gtbFxTransferForm.value.transferAmt.replace(',', ''),
      'beneName': beneficiaryName
    };

    // this.reqBody = {
    //   'accountToDebit': this.acctToDebitFX.nuban,
    //   'accountToCredit': beneficiaryAcctNo,
    //   'beneName': beneficiaryName,
    //   'amount': JSON.stringify(this.gtbFxTransferForm.value.transferAmt),
    //   'type': 2,
    //   'requestType': 'FX TRANSFER',
    //   'TransType': 'GTBDomThirdParty',
    //   'purpose': this.gtbFxTransferForm.value.paymentpurpose.name,
    //   'secretAnswer': this.gtbFxTransferForm.value.secretAnsw,
    //   'remark': this.gtbFxTransferForm.value.remark,
    // };
    this.formSubmit = true;
    console.log(this.reqBody);
  }
  // this method creates a reactive form for GT to GT transfers
  createGtbFxTransferForm() {
    this.gtbFxTransferForm = this.fb.group({
      'acctToDebitFX': [this.acctToDebitFX, Validators.required],
      'beneficiaryOption': ['SAVED', Validators.required],
      'newBeneficiary': '',
      'savedBeneficiary': '',
      'transferAmt': ['', Validators.required],
      'remark': '',
      'paymentpurpose': ['', Validators.required],
      'secretAnsw': ['', Validators.required],
      'notice': [false, Validators.required]
    });
  }

  clearBeneficiary() {
    this.createGtbFxTransferForm();
    this.gtbFxTransferForm.controls['savedBeneficiary'].patchValue('');
    this.gtbFxTransferForm.controls['newBeneficiary'].patchValue('');
    this.newBeneficiaryDetail = '';
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


  saveBeneficiary(beneficiary: any) {
    this.beneficiaryMessage = 'Saving beneficiary..';
    this.reqBody = {
      'BeneficiaryName': beneficiary.accountName,
      'BeneficiaryAccount': beneficiary.nuban,
      'BeneficiaryBankCode': '058',
      'TransactionType': ' GTBThirdParty',
      'BeneficiaryLinktypes': 0,
      'CustomerIdentifier': beneficiary.nuban,
      'CustomerIdentifierType': 0,
      'secretAnswer': '',
    };
    console.log(this.reqBody);
    this.transferService.manageBeneficiaryRequest(this.reqBody)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.beneficiaryMessage = 'Beneficiary was saved Successfully!';
          this.clearBeneficiary();
        } else {
          this.beneficiaryMessage = 'Failed to save beneficiary. Try again';
        }
        this.removeError();
      },
      (err: any) => {
        console.log(err);
        this.beneficiaryMessage = 'Failed to save beneficiary. Try again';
        this.removeError();
      }
    );
    this.reqBody = null;
    console.log(this.beneficiaryMessage);
  }


  deleteBeneficiary(beneficiary: Beneficiaries) {
    this.beneficiaryMessage = 'Deleting beneficiary..';
    this.reqBody = {
      'BeneficiaryName': beneficiary.name,
      'BeneficiaryAccount': beneficiary.accountNumber,
      'BeneficiaryBankCode': beneficiary.bankCode,
      'TransactionType': 'GTBThirdParty',
      'BeneficiaryLinktypes': 1,
      'CustomerIdentifier': beneficiary.accountNumber,
      'CustomerIdentifierType': 0,
      'secretAnswer': '',
    };
    this.transferService.manageBeneficiaryRequest(this.reqBody)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.beneficiaryMessage = 'Beneficiary deleted Successfully!';
          this.clearBeneficiary();
        } else {
          this.beneficiaryMessage = 'Failed to delete beneficiary. Try again';
        }
        this.removeError();
      },
      (err: any) => {
        console.log(err);
        this.beneficiaryMessage = 'Failed to delete beneficiary. Try again';
        this.removeError();
      }
    );
    this.reqBody = null;
    console.log(this.beneficiaryMessage);
  }

  removeError() {
    setTimeout(() => {
      this.beneficiaryMessage = '';
    }, 10000);
  }

}
