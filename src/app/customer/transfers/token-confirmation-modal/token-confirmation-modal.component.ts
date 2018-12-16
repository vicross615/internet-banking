import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UtilitiesService } from '../../../_services/utilities.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransferService } from '../_services/transfer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { StandingOrderService } from '../standing-order/standing-order.service';
import { CardsService } from '../../cards/cards.service';
import { InvestmentServices } from '../../investments/investment.service';
import { CurrencyPipe } from '@angular/common';
import { GenerateStatementService } from '../../accounts/generate-statement/generate-statement.service';
import { CustomerService } from '../../_customer-service/customer.service';
import { FxService } from '../../fx/fx.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-token-confirmation-modal',
  templateUrl: './token-confirmation-modal.component.html',
  styleUrls: ['./token-confirmation-modal.component.scss'],
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
  ]
})
export class TokenConfirmationModalComponent implements OnInit, OnDestroy {
  @Output()
  tokenVissibilityEvent = new EventEmitter<boolean>();
  @Output()
  resetFormEvent = new EventEmitter<boolean>();
  @Input()
  body;
  @Input()
  transactionType;
  @Input()
  isToken: boolean;
  @Input()
  category;
  public tokenForm: FormGroup;
  public isLoading = false;
  public message: string;
  isSuccess: boolean;
  submited: boolean;

  constructor(
    private util: UtilitiesService,
    private fb: FormBuilder,
    private transferService: TransferService,
    private standingOrder: StandingOrderService,
    private cardsService: CardsService,
    private statementService: GenerateStatementService,
    private currencyPipe: CurrencyPipe,
    private investment: InvestmentServices,
    private customerService: CustomerService,
    private fxService: FxService
  ) {}

  ngOnInit() {
    this.tokenForm = this.fb.group({
      authValue: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(6)])
      ]
    });
    console.log('Request Params: ' + JSON.stringify(this.body));
    console.log(this.message);
    console.log(this.body);
  }

  ngOnDestroy(): void {

  }

  closeTokenForm() {
    setTimeout(() => {
      this.tokenVissibilityEvent.emit(false);
    }, 300);
  }

  InitiateTransaction(formValues) {
    this.isLoading = true;
    this.submited = true;
    this.body.authMode = 'TOKEN';
    this.body.authValue = JSON.stringify(formValues.authValue);
    console.log(this.body);
    console.log(this.transactionType);
    console.log(JSON.stringify(formValues));
    switch (this.transactionType) {
      case 'intraTransfers':
      case 'preRegTransfers':
        this.intraTransfers();
        break;
      case 'interTransfers':
        this.interTransfers();
        break;
      case 'othSI':
        this.SiToOtherBank();
        break;
      case 'gtSI':
        this.SiToGTBank();
        break;
      case 'cardReplacement':
        this.cardReplacementFunc();
        break;
      case 'sendStatement':
        this.sendStatement();
        break;
      case 'salaryAdvance':
      case 'schoolFeesAdvance':
        this.bookLoan();
        break;
      case 'OtherbankfxTransfer':
      case 'fxintraTransfers':
        this.fxTransferToOtherBank();
        break;
      default:
        break;
    }
  }

  handleResponse(res) {
    console.log(res);
    if (res.responseCode === '00') {
      this.isLoading = false;
      this.message = 'Your transaction was successful.';
      this.isSuccess = true;
      this.resetFormEvent.emit(true);
      this.customerService.getAcctDetailsData();
    } else {
      this.isLoading = false;
      this.message = this.util.handleResponseError(res);
      this.isSuccess = false;
    }
  }

  handleError(error) {
    this.isLoading = false;
    this.message = error;
    console.log(error);
  }

  intraTransfers() {
    delete this.body.beneficiaryName;
    console.log(this.body); // Delete later
    this.transferService.intraTransfers(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        console.log(res)
        this.handleResponse(res);
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  interTransfers() {
    console.log(this.body); // Delete later
    this.transferService.interTransfers(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        this.handleResponse(res);
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  sendStatement() {
    console.log(this.body); // Delete later
    this.statementService.sendStatement(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.isLoading = false;
          this.message = `Your statement was sent successfully.
           You have been charged <span class="text-primary">
           ${this.currencyPipe.transform(
             res.embassyStatement.amount,
             '₦'
           )}</span> for this service.`;
          this.resetFormEvent.emit(true);
          this.isSuccess = true;
        } else {
          this.isLoading = false;
          this.message = this.util.handleResponseError(res);
          this.isSuccess = false;
        }
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  SiToOtherBank() {
    console.log(this.body); // Delete later
    this.standingOrder.StandingInstructionOtherBank(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        this.handleResponse(res);
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  SiToGTBank() {
    console.log(this.body); // Delete later
    this.standingOrder.StandingInstructionGTB(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        this.handleResponse(res);
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  cardReplacementFunc() {
    console.log(this.body); // Delete later
    this.cardsService.cardRequest(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        console.log(res);
        this.handleResponse(res);
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  bookLoan() {
    console.log(JSON.stringify(this.body)); // Delete later
    this.investment.loanBookingRequest(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        this.handleResponse(res);
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);  
      }
    );
  }

  fxTransferToOtherBank() {
    console.log(this.body); // Delete later
    this.fxService.otherBankFXTransfer(this.body)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        this.handleResponse(res);
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }
}
