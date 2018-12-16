import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable,  Subject} from 'rxjs';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Beneficiary, Beneficiaries, AcctToDebit, FreqBeneficiaries } from '../../_customer-model/customer.model';
import { CustomerService } from '../../_customer-service/customer.service';
import { distinctUntilChanged, filter, map, debounceTime, merge} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TransferService } from '../_services/transfer.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { UtilitiesService } from '../../../_services/utilities.service';


// component decorator
@Component({
  selector: 'app-gt-transfers',
  templateUrl: './quick-transfer.component.html',
  // styles: [`.form-control { width: 300px; display: inline; }`],
  styleUrls: ['./quick-transfer.component.scss'],
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

export class QuickTransferComponent implements OnInit, OnDestroy {
  public quickTransfersForm: FormGroup;
  transferType: string;
  transactionType: string;
  beneficiary: FreqBeneficiaries;
  transferLimit = 0.00;
  message = '';
  isLoading: boolean;
  loadingBeneficiary: boolean;
  accountToDebit: AcctToDebit = null;
  formSubmit = false;
  reqBody: Object;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private router: Router,
    public util: UtilitiesService
  ) {
    this.createquickTransfersForm();
    this.returnTransferLimit();
    this.transferService.selectedfreqBeneficiary$.pipe(untilComponentDestroyed(this))
    .subscribe(
      ben => {
        this.beneficiary = ben; console.log(this.beneficiary);
        this.quickTransfersForm.controls['transferAmt'].setValue(this.beneficiary.amount);
        this.transferType = ben.transferType;
      }
    );
    setTimeout(() => {
    }, 1000);
  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.quickTransfersForm.controls['acctToDebit'].setValue($event);
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createquickTransfersForm();
      // this.router.navigate(['dashboard']);
      this.beneficiary = null;
    }
  }

  ngOnInit() {
    console.log('quickTransferforms');

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
      (err: HttpErrorResponse) => {
        console.error('Session is expired, please Login');
        console.log(err);
      }
    );
  }

  // Method that opens the Token confirmation modal
  openTokenConfirmation() {
    if (this.transferType === 'GTB-GTB Transfer') {
      this.transactionType = 'intraTransfers';
      this.intraTransfers();
    } else if (this.transferType === 'NIP') {
      this.transactionType = 'interTransfers';
      this.interTransfers();
    }
    this.formSubmit = true;
    console.log(this.reqBody);
  }

  intraTransfers() {
    this.reqBody = {
      'accountToDebit': this.quickTransfersForm.value.acctToDebit.nuban,
      'accountToCredit': this.beneficiary.beneficiaryAcc,
      'beneName': this.beneficiary.customerName,
      'amount': this.quickTransfersForm.value.transferAmt.replace(',', ''),
      'type': 2,
      'requestType': 'TRANSFER',
      'purpose': '3rdParty Intra-Transfer',
      'secretAnswer': this.quickTransfersForm.value.secretAnsw,
      'remark': this.quickTransfersForm.value.remark,
    };
  }

  interTransfers() {
    this.reqBody = {
      'nubanAccountToDebit': this.quickTransfersForm.value.acctToDebit.nuban,
      'nubanAccountToCredit': this.beneficiary.beneficiaryAcc,
      'beneName': this.beneficiary.customerName,
      'beneBankCode': this.beneficiary.bankCode,
      'beneEmail': '',
      'benePhone': '',
      'amount': this.quickTransfersForm.value.transferAmt.replace(',', ''),
      'type': 3,
      'requestType': 'TRANSFER',
      'purpose': 'Inter-Transfer-NIP',
      'secretAnswer': this.quickTransfersForm.value.secretAnsw,
      'remark': this.quickTransfersForm.value.remark,
    };
  }
  // this method creates a reactive form for GT to GT transfers
  createquickTransfersForm() {
    this.quickTransfersForm = this.fb.group({
      'acctToDebit': [this.accountToDebit, Validators.required],
      'transferAmt': ['', Validators.required],
      'remark': '',
      'secretAnsw': ['', Validators.required]
    });
  }

  removeMessage() {
    setTimeout(() => {
      this.message = '';
    }, 10000);
  }

}
