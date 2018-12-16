import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Beneficiary, AcctToDebit, AcctDetails } from '../../_customer-model/customer.model';
import { CustomerService } from '../../_customer-service/customer.service';
import { distinctUntilChanged, filter, map, debounceTime, merge } from 'rxjs/operators';
import { UtilitiesService } from '../../../_services/utilities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TransferService } from '../_services/transfer.service';
import { CurrencyPipe } from '@angular/common';
import { TokenConfirmationModalComponent } from '../token-confirmation-modal/token-confirmation-modal.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
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
export class PhoneComponent implements OnInit, OnDestroy {
  public viaPhoneTransferForm: FormGroup;
  beneficiaryLabel = 'Enter Beneficiary`s Phone number';
  transferLimit = 0.00;
  successMessage: any = '';
  errorMessage: any = '';
  isLoading: boolean;
  public acctToDebit: Array<any> = [];
  beneficiary: AcctDetails;
  public accountToDebit: AcctToDebit = null;
  public loadingBeneficiary: boolean;
  public formSubmit: boolean;
  public reqBody: Object;
  beneficiaryMessage: string;
  selectedAcct: AcctDetails;
  charges: any;
  chargesError: string;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    private cp: CurrencyPipe,
    public util: UtilitiesService
  ) {
    this.util.charges$.subscribe(c => this.charges = c);
    this.util.chargesError$.subscribe(err => this.chargesError = err);
    this.createViaPhoneTransferForm();
    this.returnTransferLimit();
    this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(acct => this.selectedAcct = acct);
  }

  ngOnDestroy(): void {

  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.viaPhoneTransferForm.controls['acctToDebit'].patchValue($event);
    this.util.getChargesData(this.accountToDebit.nuban, '235');
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createViaPhoneTransferForm();
      this.beneficiary = null;
    }
  }

  changeLabel(label: string) {
    this.beneficiaryLabel = label;
  }

  ngOnInit() {

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
          console.log('Session is expired, please Login');
          console.log(err);
        }
      );
  }

  public getBeneficiary() {
    this.loadingBeneficiary = true;
    this.errorMessage = '';
    const body: any = {};
    body.phoneNumber = this.viaPhoneTransferForm.value.phone;
    body.email = this.viaPhoneTransferForm.value.email;
    body.bvn = '';
    body.category = 1;
    body.customerNumber = '';
    body.ForTransfer = true;
    this.customerService.customerValidationUpdated(body)
      .pipe(untilComponentDestroyed(this))
    .subscribe(
        (res: any) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.beneficiary = res.accountDetails[0];
            console.log('Beneficiary Details' + JSON.stringify(this.beneficiary));
            this.errorMessage = '';
            if (res.accountDetails.length > 0) {
              this.successMessage = 'Successful';
              this.loadingBeneficiary = false;
            } else {
              this.errorMessage = 'No account was found. Please try again';
              this.loadingBeneficiary = false;
            }
          } else {
            this.errorMessage = 'No account was found. Please try again';
            this.successMessage = '';
            this.loadingBeneficiary = false;
          }
          this.loadingBeneficiary = false;
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
          this.errorMessage = 'No account was found. Please try again';
          this.loadingBeneficiary = false;
        }
      );

  }

  // Method that opens the Token confirmation modal
  openTokenConfirmation() {
    console.log(JSON.stringify(this.viaPhoneTransferForm.value));
    this.reqBody = {
      'accountToDebit': this.viaPhoneTransferForm.value.acctToDebit.nuban,
      'beneName': this.beneficiary.cusname,
      'accountToCredit': this.beneficiary.fullaccountkey,
      'amount': this.viaPhoneTransferForm.value.transferAmt.replace(',', ''),
      'type': 2,
      'requestType': 'TRANSFER',
      'purpose': '3rdParty Intra-Transfer-viaPhone/Email',
      'secretAnswer': this.viaPhoneTransferForm.value.secretAnsw,
      'remark': this.viaPhoneTransferForm.value.remark,
    };
    this.formSubmit = true;
    console.log(this.reqBody); // Delete later
  }

  // this method creates a reactive form for GT to GT transfers
  createViaPhoneTransferForm() {
    this.viaPhoneTransferForm = this.fb.group({
      'acctToDebit': ['', Validators.required],
      'beneficiaryOption': ['PHONE', Validators.required],
      'phone': ['', Validators.maxLength(11)],
      'email': ['', Validators.email],
      'transferAmt': ['', Validators.required],
      'remark': '',
      'secretAnsw': ['', Validators.required]
    });
  }

  clearBeneficiary() {
    this.viaPhoneTransferForm.controls['phone'].patchValue('');
    this.viaPhoneTransferForm.controls['email'].patchValue('');
    this.successMessage = '';
    this.beneficiary = null;
  }

  saveBeneficiary(beneficiary: AcctDetails) {
    this.beneficiaryMessage = 'Saving beneficiary..';
    this.reqBody = {
      'BeneficiaryName': beneficiary.cusname,
      'BeneficiaryAccount': beneficiary.map_acc_no,
      'BeneficiaryBankCode': '058',
      'TransactionType': ' GTBThirdParty',
      'BeneficiaryLinktypes': 0,
      'CustomerIdentifier': this.selectedAcct.map_acc_no,
      'CustomerIdentifierType': 0,
      'secretAnswer': '',
    };
    console.log(this.reqBody);
    this.customerService.getBeneficiariesData('GTBThirdParty');
    this.transferService.manageBeneficiaryRequest(this.reqBody)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.beneficiaryMessage = 'Beneficiary was saved Successfully!';
          // this.clearBeneficiary();
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

  removeError() {
    setTimeout(() => {
      this.beneficiaryMessage = '';
    }, 5000);
  }

}
