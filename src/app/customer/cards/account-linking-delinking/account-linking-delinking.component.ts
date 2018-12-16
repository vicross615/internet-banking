import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { transition, style, trigger, animate } from '@angular/animations';
import { Cards } from '../cards.model';
import { CardsService } from '../cards.service';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { NullAstVisitor } from '@angular/compiler';
import {UtilitiesService} from '../../../_services/utilities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-account-linking-delinking',
  templateUrl: './account-linking-delinking.component.html',
  styleUrls: ['./account-linking-delinking.component.scss'],
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
export class AccountLinkingDelinkingComponent implements OnInit, OnDestroy {
  public notifications: IbankNotifications = {};
  cards: Array<Cards>;
  selectedCard: Cards;
  isLoading: boolean;
  errorMessage: string;
  successMessage: string;
  accountType: string;
  accountLinkingDelinkingForm: FormGroup;
  loadingTransactions: boolean;
  reasons: Array<Object>;
  requestType: any;
  formSubmit = false;
  reqBody: Object;
  public accountToDebit: AcctToDebit = null;

  constructor(
    private fb: FormBuilder,
    public cardsService: CardsService,
    public util: UtilitiesService
  ) {

    this.cardsService.cards$.pipe(untilComponentDestroyed(this))
    .subscribe(
      cards => this.cards = cards
    );
    console.log(this.cards);

    this.cardsService.selectedCard$.pipe(untilComponentDestroyed(this))
    .subscribe(
      card => this.selectedCard = card
    );
    console.log(this.selectedCard);
    cardsService.cardsError$.pipe(untilComponentDestroyed(this))
    .subscribe(
      message => this.errorMessage = message
    );
    this.createAccountLinkingDelinkingForm();

  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.accountLinkingDelinkingForm.controls['acctToDebit'].patchValue($event);
  }

  resetFormEventHandler($event) {
    console.log($event);
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

  tokenEventHandler($event) {
    console.log($event);
  }

  ngOnInit() { }

  ngOnDestroy(): void {

  }

  createAccountLinkingDelinkingForm() {
    this.accountLinkingDelinkingForm = this.fb.group({
      'acctToDebit': [this.accountToDebit, Validators.required],
      'linkType': ['0', Validators.required],
      'secretAnsw': ['', Validators.required],
      'tokenValue': ['', Validators.required],
    });
  }

  onSubmit() {
    this.loadingTransactions = true;
    this.accountType = this.accountLinkingDelinkingForm.value.acctToDebit.accountType;
    if (this.accountType === 'SAVINGS ACCOUNT') {
      this.accountType = '10';
    } else {
      this.accountType = '20';
    }

    const Body = {
      'linkType': this.accountLinkingDelinkingForm.value.linkType,
      'acctType': this.accountType,
      'nuban': this.accountLinkingDelinkingForm.value.acctToDebit.nuban,
      'fourDigit': this.selectedCard.pan.slice(12, 16),
      'authValue': this.accountLinkingDelinkingForm.value.tokenValue,
      'secretAnswer': this.accountLinkingDelinkingForm.value.secretAnsw,
    };
    console.log(Body);

    this.cardsService.accountLinkingDelinking(Body).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this //
        if (res.responseCode === '00') {
          this.createAccountLinkingDelinkingForm();
          this.setNotification(
            'success',
            'Successful',
             `${res.responseDescription}`
            );
          this.loadingTransactions = false;
        } else {
          this.createAccountLinkingDelinkingForm();
          this.setNotification(
            'error',
            'Transaction Error',
            `${this.util.handleResponseError(res.responseDescription)}`
          );
          this.loadingTransactions = false;
        }
      },
      (error: HttpErrorResponse) => {
        this.loadingTransactions = false;
        this.createAccountLinkingDelinkingForm();
        this.setNotification(
          'error',
          'Transaction Error',
          `${error}`
        );
      }
    );
  }
}
