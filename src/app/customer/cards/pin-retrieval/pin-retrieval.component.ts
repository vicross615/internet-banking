import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Cards } from '../cards.model';
import { CardsService } from '../cards.service';
import { UtilitiesService } from '../../../_services/utilities.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { AcctToDebit } from '../../_customer-model/customer.model';

@Component({
  selector: 'app-pin-retrieval',
  templateUrl: './pin-retrieval.component.html',
  styleUrls: ['./pin-retrieval.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ],
})
export class PinRetrievalComponent implements OnInit, OnDestroy {
  public notifications: IbankNotifications = {};
  cards: Cards[];
  selectedCard: Cards;
  PinRetrievalForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  public accountToDebit: AcctToDebit = null;
  loadingTransactions: boolean;

  constructor(
    private fb: FormBuilder,
    public cardsService: CardsService,
    private util: UtilitiesService
  ) {
    this.cardsService.cards$.pipe(untilComponentDestroyed(this))
    .subscribe(
      cards => this.cards = cards
    );
  }

  ngOnInit() {
    this.cardsService.selectedCard$.pipe(untilComponentDestroyed(this))
    .subscribe(
      selectedCard => this.selectedCard = selectedCard
    );
    
    //console.log(this.selectedCard);
    // this.cardsService.getCardStatusData();
    this.createPinRetrievalForm();

  }

  ngOnDestroy(): void {

  }

  clearError() {
    this.errorMessage = null;
    this.successMessage = null;
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


  createPinRetrievalForm() {
    this.PinRetrievalForm = this.fb.group({
      'acctToDebit': [this.accountToDebit, Validators.required],
      'secretAnswer': ['', Validators.required],
      'tknvalue': ['', Validators.required],
    });
  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.PinRetrievalForm.controls['acctToDebit'].patchValue($event);
  }


  onSubmitRtrval(formValue) {
    this.loadingTransactions = true;
    console.log(formValue);
    const body = {
      //'month': this.selectedCard.expirydate.substring(0, 2),
      //'year': this.selectedCard.expirydate.substring(2, 4),
      'authMode': 'TOKEN',
      'authValue': formValue.tknvalue,
      'nubanAccount': this.PinRetrievalForm.value.acctToDebit.nuban,
      'pan': this.selectedCard.pan,
      'secretAnswer': formValue.secretAnswer,
    };

    console.log(body)
    this.cardsService.getRetrievedPin(body).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.createPinRetrievalForm();
          this.setNotification(
          'success',
          'Successful',
           `${'Your Card Pin is ' + res.pin + ''}`
          );
         this.loadingTransactions = false;
        } else {
          this.setNotification(
            'error',
            'Transaction Error',
            `${'cannot retrieve card pin: ' + this.util.handleResponseError(res)}`
          );
          this.loadingTransactions = false;
        }
      },
      err => this.util.handleError(err)
    );
    setTimeout(() => {
      this.successMessage = null;
    }, 6000);
  }
}











