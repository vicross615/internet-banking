import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesService } from '../../../_services/utilities.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransferService } from '../_services/transfer.service';
import { environment } from '../../../../environments/environment';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { UserService } from '../../../_services/user.service';

@Component({
  selector: 'app-cardless-withdrawal',
  templateUrl: './cardless-withdrawal.component.html',
  styleUrls: ['./cardless-withdrawal.component.scss'],
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
  ]
})
export class CardlessWithdrawalComponent implements OnInit, OnDestroy {
  public notifications: IbankNotifications = {};
  public cardlessWithdrawalForm: FormGroup;
  public withdrawalLimit = environment.ATM_LIMIT;
  public successMessage: string;
  public errorMessage: string;
  public isLoading: boolean;
  public formSubmit = false;
  public reqBody: Object;
  transferSuccessMessage: any;
  transferErrorMessage: any;
  amountSubmitted = false;
  limitError: string;
  public keypadNumbers = ['1000', '3000', '5000', '7000', '12000', '15000'];
  cardLoad: string;


  constructor(
    private fb: FormBuilder,
    private cp: CurrencyPipe,
    private dp: DatePipe,
    private transferService: TransferService,
    public util: UtilitiesService,
    private userService: UserService
  ) {
    this.createCardlessWithdrawalForm();
  }

  acctToDebitEventHander($event: any) {
    this.cardlessWithdrawalForm.controls['acctToDebit'].patchValue($event);
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createCardlessWithdrawalForm();
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  createCardlessWithdrawalForm() {
    this.cardlessWithdrawalForm = this.fb.group({
      'option': ['GTRESCUE', Validators.required],
      'acctToDebit': ['', Validators.required],
      // 'beneficiaryName': this.userService.getUserDetails().userFullName,
      'beneficiaryPhoneNumber': ['', Validators.required],
      'cashOutAmt': ['', Validators.required],
      // 'cashOutTerminal': 'ATM',
      // 'cashOutPIN': '0',
      'secretAnsw': ['', Validators.required],
      'token': ['', Validators.required]
    });
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

  gtRescue() {
    if (this.cardlessWithdrawalForm.value.cashOutAmt > this.withdrawalLimit) {
      this.setNotification(
        'info',
        'Limit Exceeded',
        `Amount should be below ${this.cp.transform(this.withdrawalLimit, '₦')}.`
      );
    } else {
      this.isLoading = true;
      const body = {
        'AccountToDebit': this.cardlessWithdrawalForm.value.acctToDebit.nuban,
        'BeneName': this.userService.getUserDetails().userFullName,
        'BenePhone': this.cardlessWithdrawalForm.value.beneficiaryPhoneNumber,
        'CeneEmail': this.userService.getUserDetails().email,
        'CustomerIdentifier': this.cardlessWithdrawalForm.value.acctToDebit.nuban,
        'CustomerIdentifierType': 0,
        'Amount': this.cardlessWithdrawalForm.value.cashOutAmt,
        'AuthType': 0,
        'AuthValue': this.cardlessWithdrawalForm.value.token,
        'SecretAnswer': this.cardlessWithdrawalForm.value.secretAnsw,
        'Remark': '',
      };
      console.log(body);
      this.transferService.cardlessWithdrawal(body)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.responseCode === '00') {
              this.isLoading = false;
              this.transferSuccessMessage = res;
              this.createCardlessWithdrawalForm();
              this.setNotification(
                'success',
                'Successful',
                `<ul class="text-dark text-left f-14 mt-4">
                <li class="p-2 mb-1 bg-light b-radius-5">
                <span class="f-w-500">Withdrawal code: </span>
                <span class="float-right">
                ${this.transferSuccessMessage.CashlessCode}
                </span>
                </li>
                <li class="p-2 mb-1 bg-light b-radius-5">
                <span class="f-w-500">Code expires on: </span>
                <span class="float-right">
                ${this.dp.transform(this.transferSuccessMessage.CodeExpiry, 'medium')}
                </span>
                </li>
                <li class="p-2 mb-1 bg-light b-radius-5">
                  <span class="f-w-500">Charges: </span>
                  <span class="float-right">
                  ${this.cp.transform(this.transferSuccessMessage.ChargeAmount, '₦')}
                  </span>
                  </li>
              </ul>`
              );
              // this.successAlert(res);
            } else {
              this.isLoading = false;
              this.transferErrorMessage = this.util.handleResponseError(res);
              this.setNotification(
                'error',
                'Transaction Error',
                `${this.transferErrorMessage}`
              );
              console.log(this.transferErrorMessage);
            }
          },
          (err: any) => {
            this.transferErrorMessage = err;
            this.setNotification(
              'error',
              'Transaction Error',
              `${this.transferErrorMessage}`
            );
            console.log(this.transferErrorMessage);
            this.isLoading = false;
          }
        );
    }
  }

  // clearSuccess() {
  //   this.transferSuccessMessage = null;
  //   this.transferErrorMessage = null;
  //   this.createCardlessWithdrawalForm();
  //   this.formSubmit = false;
  //   this.amountSubmitted = false;
  // }

  addAmount(value) {
    let amt = this.cardlessWithdrawalForm.controls['cashOutAmt'].value;
    if (amt === '') {
      amt = 0;
    }
    amt = parseInt(amt, 10) + parseInt(value, 10);
    this.cardlessWithdrawalForm.controls['cashOutAmt'].setValue(amt);
    this.checkLimit(amt);
  }

  clearAmount() {
    this.cardlessWithdrawalForm.controls['cashOutAmt'].setValue(0.00);
  }

  checkLimit(amt) {
    console.log(this.withdrawalLimit);
    if (amt > this.withdrawalLimit) {
      this.limitError = `You can not withdraw above ${this.cp.transform(this.withdrawalLimit, '₦')}.`;
    } else { this.limitError = ''; }
    // this.util.formatCurrency(this.cardlessWithdrawalForm.controls['cashOutAmt']);
  }

  submitAmount() {
    const amt = this.cardlessWithdrawalForm.controls['cashOutAmt'].value;
    if (!amt) {
      this.limitError = `Please select amount to cashout.`;
    } else { this.amountSubmitted = true; }
  }

}
