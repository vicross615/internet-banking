import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cards } from '../cards.model';
import { CardsService } from '../cards.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { transDetails, BankName } from '../dispense-error/dispense-error.model';
import { DispenseErrorService } from '../dispense-error/dispense-error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject} from 'rxjs';
import { UtilitiesService } from '../../../_services/utilities.service';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';

// import { Routes, RouterModule } from '@angular/router';
// import { TokenConfirmationModalComponent } from '../token-confirmation-modal/token-confirmation-modal.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-dispense-error',
  templateUrl: './dispense-error.component.html',
  styleUrls: ['./dispense-error.component.scss'],
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

export class DispenseErrorComponent implements OnInit, OnDestroy {
  public notifications: IbankNotifications = {};
  cards: Cards[];
  selectedCard: Cards;
  dispenseErrorForm: FormGroup;
  public acctToDebit: Array<any> = [];
  public accountToDebit: AcctToDebit = null;
  errorMessage: string;
  data: string;
  bankName: BankName[];
  selectedBank: string;
  successMessage = '';
  selectedTransact: transDetails;
  public transactionDetail: any;
  public loadingTransactions: boolean;
  date: any;
  dateConcatenate: any;
  transDate: any;

  @ViewChild('bankNameInstance') bankNameInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    public cardsService: CardsService,
    private dispenseErrorService: DispenseErrorService,
    private util: UtilitiesService

  ) {
    this.data = 'Angular Rebuild';
    this.cardsService.cards$.pipe(untilComponentDestroyed(this))
    .subscribe(
      cards => this.cards = cards
    );
    this.cardsService.selectedCard$.pipe(untilComponentDestroyed(this))
    .subscribe(
      selectedCard => this.selectedCard = selectedCard
    );

    this.dispenseErrorService.banks$.subscribe(   
      bankName => this.bankName = bankName
    );

    
  }

  ngOnInit() {
    this.createDispenseErrorForm();
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

  createDispenseErrorForm() {
    this.dispenseErrorForm = this.fb.group({
      'transactionDate': ['', Validators.required],
      'acctToDebit': [this.accountToDebit, Validators.required],
      'bankName': ['', Validators.required],
    });
  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.dispenseErrorForm.controls['acctToDebit'].patchValue($event);
  }

  async bankNameEventHander($event: any) {
    const code = $event.code;
    // console.log('parent:' + JSON.stringify(this.selectedBank));
    this.dispenseErrorForm.controls['bankName'].patchValue($event);
  }

  public getTransactionDetails() {
    this.transDate = this.util.formatDate(this.dispenseErrorForm.value.transactionDate);
    this.loadingTransactions = true;
    this.selectedBank = this.dispenseErrorForm.value.bankName.name;
    this.date = this.dispenseErrorForm.value.transactionDate;
    this.dateConcatenate = this.date.day + '-' + this.date.month + '-' + this.date.year;
    const body = {
      'acctToDebit': this.accountToDebit.nuban,
      'pan': this.selectedCard.pan,
      'transactionDate': this.dateConcatenate
    };

    this.dispenseErrorService.getCardTransactions(body).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.transactionDetail = res.serv;
          console.log('Transactions: ' + JSON.stringify(this.transactionDetail));
          this.errorMessage = '';
          this.loadingTransactions = false;
          // this.successMessage = 'Successful';
        } else {
          this.createDispenseErrorForm();
          this.setNotification(
            'error',
            'Transaction Error',
            `${res.responseDescription}`
          );
          this.loadingTransactions = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.createDispenseErrorForm();
        this.setNotification(
          'error',
          'Transaction Error',
          `${err.error}`
        );
        console.log(err.error);
      }
    );
  }

  backBtn() {
    this.transactionDetail = null;
    this.createDispenseErrorForm();
  }

  logDispenseError(trans) {
    this.selectedTransact = trans;
    const body = {
      'pan': this.selectedCard.pan,
      'transactionDate': this.selectedTransact.transactionDate,
      'acctToDebit': this.accountToDebit.nuban,
      'bankName': this.dispenseErrorForm.value.bankName.name,
      'card': this.selectedCard.pan,
      'TransactionRemark': this.selectedTransact.remarks,
      'doc_Num': this.selectedTransact.doc_Num,
      'transactionAmount': this.selectedTransact.amount,
    };
    this.dispenseErrorService.logDispenseErrorTransaction(body)
      .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.createDispenseErrorForm();
          this.transactionDetail = null;
          this.setNotification(
            'success',
            'Successful',
             `${res.responseDescription}`
            );
        } else {
          this.setNotification(
            'error',
            'Transaction Error',
            `${this.util.handleResponseError(res.responseDescription)}`
          );
          this.transactionDetail = null;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.setNotification(
          'error',
          'Transaction Error',
          `${this.util.handleResponseError(err)}`);
      }
    );
  }
}
