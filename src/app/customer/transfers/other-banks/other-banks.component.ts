import { Component, OnInit, Input, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { Beneficiary, Beneficiaries, Banks, AcctToDebit, AcctDetails } from '../../_customer-model/customer.model';
import { distinctUntilChanged, debounceTime, merge, filter, map } from 'rxjs/operators';
import { TransferService } from '../_services/transfer.service';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { UtilitiesService } from '../../../_services/utilities.service';

@Component({
  selector: 'app-other-banks',
  templateUrl: './other-banks.component.html',
  styleUrls: ['./other-banks.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
  ],
})

export class OtherBanksComponent implements OnInit, OnDestroy {
  public otherBanksTransferForm: FormGroup;
  public acctToDebit: Array<any> = [];
  acctToDebitModel: string;
  public accountToDebit: AcctToDebit = null;
  public savedBeneficiaries: Array<Beneficiaries> = [];
  savedBeneficiariesModel: string;
  beneficiaryLabel = 'Enter Beneficiary`s name';
  transferLimit = 0.00;
  successMessage = '';
  errorMessage: any = '';
  public newBeneficiaryDetail: any;
  isLoading: boolean;
  loadingBeneficiary: boolean;
  public banks: Array<Banks> = [];
  banksModel: string;
  public selectedBank: Banks;
  public formSubmit: boolean;
  public reqBody: Object;
  selectedAcct: AcctDetails;

  @ViewChild('savedBeneficiariesInstance') savedBeneficiariesInstance: NgbTypeahead;
  @ViewChild('banksInstance') banksInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  beneficiaryName: any;
  beneficiaryMessage: string;
  charges: any;
  chargesError: string;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    public util: UtilitiesService
  ) {
    this.util.charges$.subscribe(c => this.charges = c);
    this.util.chargesError$.subscribe(err => this.chargesError = err);
    this.customerService.getBeneficiariesData('NIP');
    console.log('bene: ' + this.savedBeneficiaries);
    this.customerService.banks$.pipe(untilComponentDestroyed(this))
    .subscribe(
      banks => this.banks = banks
    );
    // console.log('Banks: ' + this.banks);      // delete later;
    this.createOtherBanksTransferForm();
    this.returnTransferLimit();
    this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(acct => this.selectedAcct = acct);
  }

  ngOnDestroy(): void {

  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.otherBanksTransferForm.controls['acctToDebit'].patchValue($event);
    this.getCharges();
  }

  getCharges() {
    setTimeout(() => {
      if (this.otherBanksTransferForm.value.type === '3') {
        this.util.getChargesData(this.accountToDebit.nuban, '678');
      } else {
        this.util.getChargesData(this.accountToDebit.nuban, '730');
      }
    }, 200);
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createOtherBanksTransferForm();
      this.customerService.getAcctToDebitData();
    }
  }


  changeLabel(label: string) {
    this.beneficiaryLabel = label;
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
  //  + ' - (' + x.accountNumber + ') - ' + x.bank

  setSavedBeneficiariesModel(e: NgbTypeaheadSelectItemEvent) {
    // this.newBeneficiaryDetail = null;
    this.savedBeneficiariesModel = e.item.name + ' -(' + e.item.accountNumber + ') ' + e.item.bank;
    // this.selectedSavedBeneficiaryDetail = e.item;
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
        beneficiaries => {
          this.savedBeneficiaries = beneficiaries;
          for (const h of this.savedBeneficiaries) {
            if (h.imageString === '') {
              h.image = 'assets/images/placeholder.png';
            } else {
              h.image = `data:image/jpeg;base64,${h.imageString}`;
            }
          }
          console.log(this.savedBeneficiaries);
        }
      );
    }, 2000);

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

  public onkey(nuban: string, bank: Banks) {
    if (nuban.length === 10 && this.otherBanksTransferForm.value.bank) {
      this.loadingBeneficiary = true;
      this.errorMessage = '';
      console.log('bankcode: ' + bank.code);
      this.customerService.getBeneficiary(nuban, bank.code)
        .pipe(untilComponentDestroyed(this))
      .subscribe(
          (res: Beneficiary) => {
            console.log(res);
            if (res.responseCode === '00') {
              // this.otherBanksTransferForm.controls['newBeneficiary'].patchValue(res.accountName);
              this.newBeneficiaryDetail = res;
              console.log('Beneficiary Details' + JSON.stringify(this.newBeneficiaryDetail));
              this.errorMessage = '';
              this.loadingBeneficiary = false;
            } else {
              this.errorMessage = `Unable to verify ${nuban}. Check that account number and bank selected are correct`;
              this.successMessage = '';
            }
          },
          (err: HttpErrorResponse) => {
            console.log(err.error);
            this.errorMessage = err;
            this.successMessage = '';
          }
        );
    } else if (nuban.length > 10) {
      this.successMessage = '';
      this.errorMessage = 'nuban entered is greater than 10 digit';
      this.loadingBeneficiary = false;
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
    if (this.otherBanksTransferForm.value.beneficiaryOption === 'SAVED') {
      beneficiaryName = this.otherBanksTransferForm.value.savedBeneficiary.name;
      beneficiaryAcctNo = this.otherBanksTransferForm.value.savedBeneficiary.accountNumber;
      beneficiaryBankCode = this.otherBanksTransferForm.value.savedBeneficiary.bankCode;
    } else {
      beneficiaryName = this.newBeneficiaryDetail.accountName;
      beneficiaryAcctNo = this.newBeneficiaryDetail.nuban;
      beneficiaryBankCode = this.otherBanksTransferForm.value.bank.code;
    }

    this.reqBody = {
      'AccountToDebit': this.otherBanksTransferForm.value.acctToDebit.nuban,
      'AccountToCredit': beneficiaryAcctNo,
      'beneName': beneficiaryName,
      'beneBankCode': beneficiaryBankCode,
      'beneEmail': '',
      'benePhone': '',
      'amount': this.otherBanksTransferForm.value.transferAmt.replace(',', ''),
      'type': parseInt(this.otherBanksTransferForm.value.type, 10),
      'requestType': 'TRANSFER',
      'purpose': 'Inter-Transfer-NIP',
      'secretAnswer': this.otherBanksTransferForm.value.secretAnsw,
      'remark': this.otherBanksTransferForm.value.remark,
    };
    this.formSubmit = true;
    console.log(this.reqBody);
  }

  createOtherBanksTransferForm() {
    this.otherBanksTransferForm = this.fb.group({
      'acctToDebit': ['', Validators.required],
      'beneficiaryOption': ['SAVED', Validators.required],
      'newBeneficiary': '',
      'savedBeneficiary': '',
      'bank': '',
      'transferAmt': ['', Validators.required],
      'remark': '',
      'type': '3',
      'secretAnsw': ['', Validators.required]
    });
  }

  clearBeneficiary() {
    this.customerService.getBeneficiariesData('NIP');
    this.otherBanksTransferForm.controls['savedBeneficiary'].patchValue('');
    this.otherBanksTransferForm.controls['newBeneficiary'].patchValue('');
    this.otherBanksTransferForm.controls['bank'].patchValue('');
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

  saveBeneficiary(beneficiary: any) {
    this.beneficiaryMessage = 'Saving beneficiary..';
    this.reqBody = {
      'BeneficiaryName': beneficiary.accountName,
      'BeneficiaryAccount': beneficiary.nuban,
      'BeneficiaryBankCode': this.otherBanksTransferForm.value.bank.code,
      'TransactionType': 'NIP',
      'BeneficiaryLinktypes': 0,
      'CustomerIdentifier': this.selectedAcct.map_acc_no,
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
      'TransactionType': 'NIP',
      'BeneficiaryLinktypes': 1,
      'CustomerIdentifier': this.selectedAcct.map_acc_no,
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
