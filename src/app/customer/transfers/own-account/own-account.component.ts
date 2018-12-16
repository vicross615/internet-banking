import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import { UtilitiesService } from '../../../_services/utilities.service';
import { TransferService } from '../_services/transfer.service';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { Modal } from '../transfer-message-modal/modal.model';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { CurrencyPipe } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-own-account',
  templateUrl: './own-account.component.html',
  styleUrls: [
    './own-account.component.scss',
    '../../../../assets/icon/icofont/css/icofont.css',
    '../../../../../node_modules/sweetalert2/src/sweetalert2.scss'
  ],
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
  ]
})

export class OwnAccountComponent implements OnInit, OnDestroy {
  public notifications: IbankNotifications = {};
  message: string;
  isLoading: boolean;
  transferLimit = 0.00;
  values = '';
  successMessage = '';
  errorMessage = '';
  public beneficiaryName = '';
  public ownTransferForm: FormGroup;
  // public ownAccts: Array<any> = [];
  public currencySymbol = {'NGN': '₦', 'USD': 'USD', 'GBP': 'GBP', 'EURO': 'EUR' };
  public acctToDebitModel: AcctToDebit;
  public acctToCreditModel: AcctToDebit;
  public accountToDebit: AcctToDebit = null;
  public accountToCredit: AcctToDebit = null;
  modal: Modal = new Modal();
  transferAmount: any;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    public util: UtilitiesService,
    private cp: CurrencyPipe
  ) {
    this.createOwnAcctTransferForm();
    this.returnTransferLimit();
   }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.compareAccts();
    this.ownTransferForm.controls['acctToDebit'].patchValue($event);
  }

  acctToCreditEventHander($event: any) {
    this.accountToCredit = $event;
    console.log('parent Account to Credit: ' + JSON.stringify(this.accountToCredit));
    this.compareAccts();
    this.ownTransferForm.controls['acctToCredit'].patchValue($event);
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }

  setNotification(type, title, msg) {
    this.notifications.message = msg;
    this.notifications.title = title;
    this.notifications.type = type;
  }

  visibilityHandler($event) {
    if ($event === true) {
      this.notifications = {};
    }
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

  createOwnAcctTransferForm() {
    this.ownTransferForm = this.fb.group({
      'acctToDebit': [this.accountToDebit, Validators.required],
      'acctToCredit': [this.accountToCredit, Validators.required],
      'transferAmt': ['', Validators.required],
      'remark': '',
    });
  }

  compareAccts() {
    console.log('comparing accounts');
    setTimeout(() => {
      if (this.accountToDebit === this.accountToCredit) {
        console.log('can not transfer between same accounts');
        this.acctToCreditModel = <AcctToDebit>{};
        this.ownTransferForm.controls['acctToCredit'].patchValue(null);
      }
    }, 300);
  }

  onSubmit(formValues) {
    console.log('form submitted');
    const body = {
      'accountToDebit': formValues.acctToDebit.fullAcctKey,
      'accountToCredit': formValues.acctToCredit.fullAcctKey,
      'amount': formValues.transferAmt.replace(',', ''),
      'type': 1,
      'requestType': 'TRANSFER',
      'purpose': 'Own Account Intra-Transfer',
      'authValue': '',
      'secretAnswer': '',
      'remark': formValues.remark,
    };
    this.InitiateTransfer(body);
  }

  InitiateTransfer(body) {
    this.isLoading = true;
    console.log(body);
    this.transferService.intraTransfers(body)
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.isLoading = false;
          this.setNotification(
            'success',
            'Successful',
            `<p>
            Your Transfer of
            <span class="f-w-600">${this.cp.transform(body.amount, '₦')}</span>
             to <span class="f-w-400">${this.accountToCredit.accountName}</span> was successful</p>`
          );
          // this.initiateMessageModal(body, res);
          this.customerService.getAcctToDebitData();
          this.createOwnAcctTransferForm();
          this.ownTransferForm.controls['acctToCredit'].patchValue(null);
          this.ownTransferForm.controls['acctToDebit'].patchValue(null);
        } else {
          this.initiateMessageModal(body, res);
          this.isLoading = false;
        }
      }
    );
  }

  initiateMessageModal(body, response) {
    if (response.responseCode === '00' ) {
      this.modal = new Modal();
      this.modal.refid = this.util.generateRequestId();
      this.modal.type = 'transferMessage';
      this.modal.message = 'Your transfer to';
      this.modal.messageType = 'success';
      this.modal.beneficiaryName = this.accountToCredit.accountName;
      this.modal.transferAmount = body.amount.replace(',', '');
    } else {
      this.modal = new Modal();
      this.modal.refid = this.util.generateRequestId();
      this.modal.type = 'transferMessage';
      this.modal.message = response.responseDescription;
      this.modal.messageType = 'error';
      this.modal.beneficiaryName = '';
      this.modal.transferAmount = '';
    }

  }

}
