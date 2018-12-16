import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AccountStatement, AccountStatementReqBody } from '../_model/accounts.model';
import { AcctDetails } from '../../_customer-model/customer.model';
import { CustomerService } from '../../_customer-service/customer.service';
import { AccountStatementService } from './account-statement.service';
import { transition, animate, trigger, style, state } from '@angular/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilitiesService } from '../../../_services/utilities.service';
import { HttpErrorResponse } from '@angular/common/http';
/* import { saveAs } from 'file-saver'; */
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
declare var Date: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
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
    ]),
    trigger('slideUpDown', [
      state('in', style({height: '*'})),
      transition('* => void', [
        style({height: '*'}),
        animate('300ms', style({height: 0}))
      ]),
      transition('void => *', [
        style({height: 0}),
        animate('300ms', style({height: '*'}))
      ]),
    ])
  ],
})
export class AccountStatementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('download') download: ElementRef;
  public notifications: IbankNotifications = {};
  filterForm: FormGroup;
  public accountStatement: AccountStatement[];
  public accounts: AcctDetails[];
  public selectedAcct: AcctDetails;
  public loading: boolean;
  public errorMessage: string;
  public config: any;
  remark = '';
  amount = '';
  startDate: any = new Date();
  stopDate: any = new Date();
  reqBody: AccountStatementReqBody = {};
  filter = false;
  filterType: string;
  queryType = 'This Week';
  // CURRENCY SYMBOL OBJECT USED BY THE CURRENCY PIPE TO DISPLAY RESPECTIVE SYMBOLS
  public currencySymbol = {'NGN': '₦', 'USD': 'USD', 'GBP': 'GBP', 'EURO': 'EUR' };
  downloadError: any;
  downloadPath: any;
  isGenerateReceipt: boolean;

  constructor(
    private customerService: CustomerService,
    private acctStatementServices: AccountStatementService,
    private fb: FormBuilder,
    public util: UtilitiesService
  ) {
    this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(accts => this.accounts = accts);
    this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(selected => this.selectedAcct = selected);
    this.acctStatementServices.AccountStatement$
    .subscribe(statement => this.accountStatement = statement);
    this.acctStatementServices.AccountStatementError$
    .subscribe(err => this.errorMessage = err);
  }

  ngOnInit() {
   this.setDateRange(7, 0);
   this.createFilterForm();
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
      this.errorMessage = null;
      this.downloadError = null;
    }
  }

  setDateRange(startMargin: number, stopMargin: number) {
    const date = new Date();
    const startDate = new Date();
    const stopDate = new Date();
    startDate.setDate(date.getDate() - (startMargin));
    this.startDate = startDate.toISOString().split('T')[0];
    stopDate.setDate(date.getDate() - (stopMargin));
    this.stopDate = stopDate.toISOString().split('T')[0];
    console.log(this.startDate + ' - ' + this.stopDate);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.selectedAcct.fullaccountkey);
      this.showStatement();
    }, 3000);
  }

  changeStatement(selectedAccount: AcctDetails) {
    this.selectedAcct = selectedAccount;
    this.resetFIlter();
    this.showStatement();
  }

  showStatement() {
    this.accountStatement = null;
    this.errorMessage = null;
    this.reqBody.accountNumber = this.selectedAcct.fullaccountkey;
    this.reqBody.amount = this.amount;
    this.reqBody.count = '';
    this.reqBody.historyType = 'TIMELINE';
    this.reqBody.remarks = this.remark;
    this.reqBody.startDate = this.startDate;
    this.reqBody.stopDate = this.stopDate;
    console.log(this.reqBody);
    console.log(Date.today().getDayName());
    console.log(Date());
    this.acctStatementServices.getStatement(this.reqBody);
  }

  showFilterInput(type) {
    this.filterType = type;
    this.filter = true;
  }

  filterStatement(queryType) {
    switch (queryType) {
      case 'Yesterday':
        {
          this.queryType = queryType;
          this.setDateRange(1, 1);
        }
        break;
      case 'This Week':
        {
          this.queryType = queryType;
          this.setDateRange(6, 0);
        }
        break;
      case 'Last Week':
        {
          this.queryType = queryType;
          this.setDateRange(13, 0);
        }
        break;
      case 'This Month':
        {
          this.queryType = queryType;
          this.setDateRange(30, 0);
        }
        break;
      case 'Last Month':
        {
          this.queryType = queryType;
          this.setDateRange(60, 0);
        }
        break;
      case 'Custom':
        {
          this.queryType = 'Specify Period';
          this.startDate = this.util.formatDate(this.filterForm.value.startDate);
          this.stopDate = this.util.formatDate(this.filterForm.value.stopDate);
          console.log(this.startDate + '-' + this.stopDate);
        }
        break;
      case 'Amount':
        {
          this.amount = this.filterForm.value.amount;
        }
        break;
      case 'Remark':
        {
          this.remark = this.filterForm.value.remark;
        }
        break;
      default:
        break;
    }
    this.filter = false;
    this.showStatement();
  }

  resetFIlter() {
    this.setDateRange(7, 0);
    this.remark = '';
    this.amount = '';
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      'startDate': this.startDate,
      'stopDate': this.stopDate,
      'remark': '',
      'amount': '',
    });
  }

  downloadStatement(type) {
    console.log('downloading statement' + this.queryType);
    this.loading = true;
    const body = {
      'accountNumber': this.selectedAcct.map_acc_no,
      'period': this.queryType,
      'documentType': type,
      'startDate': this.startDate,
      'endDate': this.stopDate,
      'sendViaEmail': 'NO',
    };
    this.acctStatementServices.downloadStatement(body).subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          console.log(res.statementPath);
          this.downloadPath = res.statementPath;
          setTimeout(() => {
            this.download.nativeElement.click();
            // window.open(`${res.statementPath}`, '_blank');
          }, 200);
          this.loading = false;
        } else {
          this.downloadError = this.util.handleResponseError(res);
          this.loading = false;
          this.setNotification(
            'error',
            'Download Error',
            `${this.util.handleResponseError(res)}`
          );
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.downloadError = err;
        this.loading = false;
        this.setNotification(
          'error',
          'Download Error',
          `${err}`
        );
      }
    );
  }

  // ===================== GENERATE RECEIPT TEMPLATE ========================

  generateReceipt(type) {
    console.log('generating Receipt' + this.queryType);
    this.isGenerateReceipt = true;
    const body = {
      'accountNumber': this.selectedAcct.map_acc_no,
      'period': this.queryType,
      'documentType': type,
      'startDate': this.startDate,
      'endDate': this.stopDate,
      'sendViaEmail': 'NO',
    };
    this.acctStatementServices.generateReceipt(body).subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          console.log(res.statementPath);
          this.downloadPath = res.statementPath;
          setTimeout(() => {
            this.download.nativeElement.click();
            // window.open(`${res.statementPath}`, '_blank');
          }, 200);
          this.isGenerateReceipt = false;
        } else {
          this.isGenerateReceipt = false;
          this.downloadError = this.util.handleResponseError(res);
          this.setNotification(
            'error',
            'Download Error',
            `${this.util.handleResponseError(res)}`
          );
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.downloadError = err;
        this.isGenerateReceipt = false;
        this.setNotification(
          'error',
          'Download Error',
          `${err}`
        );
      }
    );
  }

}
