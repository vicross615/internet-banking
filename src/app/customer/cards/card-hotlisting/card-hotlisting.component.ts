import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { transition, style, trigger, animate } from '@angular/animations';
import { Cards } from '../cards.model';
import { CardsService } from '../cards.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from '../../_customer-service/customer.service';
import { AcctDetails } from '../../_customer-model/customer.model';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-card-hotlisting',
  templateUrl: './card-hotlisting.component.html',
  styleUrls: ['./card-hotlisting.component.scss'],
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
export class CardHotlistingComponent implements OnInit, OnDestroy {
  // cards: Array<Cards>;
  selectedCard: Cards;
  isLoading: boolean;
  errorMessage: string;
  cardHotlistForm: FormGroup;
  reasons: { Id: string; desc: string; }[];
  selectedReason = '';
  hotlisting: boolean;
  cardHotlistMessage: any;
  reqBody: any = {};
  selectedAcct: AcctDetails;

  constructor(
    private fb: FormBuilder,
    private cardsService: CardsService,
    private customerService: CustomerService
  ) {
    this.reasons = [
      {
        Id: '',
        desc: 'Select Reason to Hotlist'
      },
      {
        Id: 'Suspected Fraud',
        desc: 'Suspected Fraud'
      },
      {
        Id: 'Lost Card',
        desc: 'Lost Card'
      },
      {
        Id: 'Stolen Card',
        desc: 'Stolen Card'
      },
      {
        Id: 'Upgrade to Platinum',
        desc: 'Upgrade to Platinum'
      },
    ];
    this.selectedReason = this.reasons[0].desc;
    this.cardsService.selectedCard$.pipe(untilComponentDestroyed(this))
    .subscribe(card => {
      this.selectedCard = card;
      // this.cardHotlistForm.controls['panLast4Digit'].patchValue(this.selectedCard.panLast4Digit);
      console.log(this.selectedCard);
    });
    this.cardsService.cardsError$.pipe(untilComponentDestroyed(this))
    .subscribe(message => this.errorMessage = message);
    this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(acct => this.selectedAcct = acct);
    this.createCardHotlistForm();

   }


  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  createCardHotlistForm() {
    this.cardHotlistForm = this.fb.group({
      'panLast4Digit': ['', Validators.required],
      'reason': ['', Validators.required],
      'udid': '',
      'otherParams': '',
      'AccountNumber': this.selectedAcct.map_acc_no || '',
      'SecretAnswer': ['', Validators.required],
      'AuthMode': ['TOKEN', Validators.required],
      'AuthValue': ['', Validators.required],
    });
  }

  onHotlist() {
    if (this.selectedReason !== '') {
      this.cardHotlistMessage = null;
    this.hotlisting = true;
    console.log(this.cardHotlistForm.value);
    this.cardsService.cardHotlisting(this.cardHotlistForm.value)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
     (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.hotlisting = false;
          this.cardHotlistMessage = 'Your card was hotlisted successfully';
        } else {
          this.cardHotlistMessage = res.responseDescription;
          this.hotlisting = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.cardHotlistMessage = 'We could not reach the server at this time';
      }
    );
    } else {
      this.cardHotlistMessage = 'Please select reason for hotlisting';
      return false;
    }

  }

  updateSelectedReason(reason) {
    this.selectedReason = reason.desc;
    this.cardHotlistForm.controls['panLast4Digit'].patchValue(this.selectedCard.panLast4Digit);
    this.cardHotlistForm.controls['reason'].setValue(reason.desc);
  }


  onSubmit(values) {
    console.log('submitted' + values);
  }

}
