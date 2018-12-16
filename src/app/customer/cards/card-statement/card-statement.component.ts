
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CardStatement, Cards, CardStatementRequest } from '../cards.model';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { CardsService } from '../cards.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import { AcctToDebit, AcctDetails } from '../../_customer-model/customer.model';
import { CardStatementService } from './card-statement.service';
import { UtilitiesService } from '../../../_services/utilities.service';

declare var Date: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'card-statement',
  templateUrl: './card-statement.component.html',
  styleUrls: ['./card-statement.component.scss'],
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
export class CardStatementComponent implements OnInit, AfterViewInit, OnDestroy {
  public acctLinkedToCard: Array<any> = [];
  public acctToDebit: Array<AcctToDebit> = [];
  public cards: Array<Cards>;
  public selectedCard: Cards;
  errorMessage: string;
  statements: CardStatement[];
  cardStatementFilterForm: FormGroup;
  reqBody: CardStatementRequest = {};
  startDate: any;
  stopDate: any;
  remark = '';
  amount = '';
  filter = false;
  filterType: string;
  queryType = 'This Week';

  constructor(
    public cardsService: CardsService,
    public cardStatementService: CardStatementService,
    private fb: FormBuilder,
    private util: UtilitiesService
  ) {
    this.cardsService.cards$
    .subscribe(cards => this.cards = cards);
    this.cardsService.selectedCard$
    .subscribe(card => this.selectedCard = card);
    this.cardsService.cardsError$
    .subscribe(message => this.errorMessage = message);
    this.cardStatementService.cardStatement$
    .subscribe(statements => this.statements = statements);
    this.cardStatementService.cardStatementError$
    .subscribe(err => this.errorMessage = err);
    this.cardsService.selectedCard$
    .subscribe(card => {
      this.selectedCard = card;
      console.log(this.selectedCard);
    });
    this.cardStatementService.cardsAcct$
    .subscribe(accts => this.acctLinkedToCard = accts);
   }

  ngOnInit() {
    // Code below creates initial start and stop date for card history.
    this.setDateRange(7, 0);
    this.createCardStatementFilterForm();
      setTimeout(() => {
      }, 3000);
  }

  ngOnDestroy(): void {

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
    this.cardStatementService.cardsAcct$
    .subscribe(accts => {
      this.acctLinkedToCard = accts;
      setTimeout(() => {
        console.log('getting statementt');
        this.showStatement('COUNT', '500');
      }, 3000);
    });
  }

  changeStatement() {
    this.resetFIlter();
    this.showStatement('COUNT', '5');
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
          this.startDate = this.util.formatDate(this.cardStatementFilterForm.value.startDate);
          this.stopDate = this.util.formatDate(this.cardStatementFilterForm.value.stopDate);
          console.log(this.startDate + '-' + this.stopDate);
        }
        break;
      case 'Amount':
        {
          this.amount = this.cardStatementFilterForm.value.amount;
        }
        break;
      case 'Remark':
        {
          this.remark = this.cardStatementFilterForm.value.remark;
        }
        break;
      default:
        break;
    }
    this.filter = false;
    // this.showStatement('T');
  }

  resetFIlter() {
    this.setDateRange(7, 0);
    this.remark = '';
    this.amount = '';
  }

  createCardStatementFilterForm() {
    this.cardStatementFilterForm = this.fb.group({
      'cardAccountNumber': ['', Validators.required],
      'maskedPAN': ['', Validators.required],
      'historyType': ['TIMELINE', Validators.required],
      'status': [1],
      'startDate': ['', Validators.required],
      'stopDate': ['', Validators.required],
      'count': [''],
      'remarks': [''],
      'amount': [''],
    });
  }

  showStatement(histType, count) {
    this.statements = null;
    this.errorMessage = null;
    this.reqBody.cardAccountNumber = this.acctLinkedToCard[0].accountNumber;
    this.reqBody.maskedPAN = this.selectedCard.pan;
    this.reqBody.status = 1;
    this.reqBody.amount = this.amount;
    this.reqBody.count = count;
    this.reqBody.historyType = histType;
    this.reqBody.remarks = this.remark;
    this.reqBody.startDate = this.startDate;
    this.reqBody.stopDate = this.stopDate;
    console.log(this.reqBody);
    console.log(Date.today().getDayName());
    console.log(Date());
    this.cardStatementService.getCardStatementData(this.reqBody);
  }

}
