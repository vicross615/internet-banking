import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../_services/utilities.service';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Cards } from './cards.model';
import { retry, catchError } from 'rxjs/operators';
import { CardStatementService } from './card-statement/card-statement.service';
import { UserService } from '../../_services/user.service';

@Injectable({ providedIn: 'root' })
export class CardsService implements OnDestroy {
  private RequestServiceURL = environment.BASE_URL + environment.REQ_SERV;
  private CustomerServiceURL = environment.BASE_URL + environment.CUST_SERV;
  private AuxServicesURL = environment.AUX_URL;
  user: any;
  body: any;

  // Observable string sources: Cards
  private cardsSource = new BehaviorSubject<Cards[]>([]);
  private selectedCardSource = new BehaviorSubject<Cards>(null);
  private cardsErrorSource = new BehaviorSubject<string>(null);

  // Observable string streams: Cards
  cards$ = this.cardsSource.asObservable();
  selectedCard$ = this.selectedCardSource.asObservable();
  cardsError$ = this.cardsErrorSource.asObservable();

  // Observable string sources: CardProtectStatus
  private cardProtectStatusSource = new Subject<any>();
  private cardProtectErrorSource = new Subject<string>();

  // Observable string streams: CardProtectStatus
  cardProtectStatus$ = this.cardProtectStatusSource.asObservable();
  cardProtectError$ = this.cardProtectErrorSource.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router,
    private statement: CardStatementService,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {}

  // =================== CARD REQUEST ==================

  cardRequest(form): Observable<any> {
    console.log(form);
    this.user = this.userService.getUserDetails();
    const PATH = this.RequestServiceURL + `/CardRequest`;
    if (this.user) {
      // If Master Dollar Card 'Request'
      if (form.reqtype === '0' && form.card_Number.code === '00') {
        let body = {
          cardType: form.card_Number.code,
          sourceName: environment.CHANNEL,
          cardVariant: '0', // Debit
          acctToCharge: form.acctToDebit.nuban,
          pickUpBranch: form.pickup_branch.code,
          pickUpAddress: form.pickup_branch.address,
          udid: '',
          otherParams: '',
          authToken: form.token,
          acctToLink: '',
          requestType: form.reqtype,
          requestReason: '',
          bvn: this.user.userBVN,
          testQuestion: form.testQuestion,
          testAnswer: form.testAnswer,
          secretAnswer: form.secretAnsw,
          authMode: 'TOKEN',
          authValue: form.token
        };
        body = this.util.addAuthParams(body);
        return this.http.post(PATH, body).pipe(
          retry(3),
          catchError(this.util.handleError)
        );
      }
      // If VirtualCard 'Request'
      if (form.reqtype === '0' && form.card_Number.code === '37') {
        let body = {
          cardType: form.card_Number.code,
          sourceName: environment.CHANNEL,
          cardVariant: '0', // Debit
          acctToCharge: form.acctToDebit.nuban,
          pickUpAddress: '',
          udid: '',
          otherParams: '',
          authToken: form.token,
          acctToLink: '',
          requestType: form.reqtype,
          bvn: this.user.userBVN,
          testQuestion: form.testQuestion,
          testAnswer: form.testAnswer,
          secretAnswer: form.secretAnsw,
          authMode: 'TOKEN',
          authValue: form.token
        };
        body = this.util.addAuthParams(body);
        return this.http.post(PATH, body).pipe(
          retry(3),
          catchError(this.util.handleError)
        );
      }
      // If Card Replacement
      if (form.reqtype === '1') {
        let body = {
          cardType: form.card_Number.cardtypecode,
          sourceName: environment.CHANNEL,
          cardVariant: '0', // Debit
          acctToCharge: form.acctToDebit.nuban,
          pickUpBranch: form.pickup_branch.code,
          pickUpAddress: form.pickup_branch.address,
          udid: '',
          otherParams: '',
          authToken: form.token,
          acctToLink: form.acctToLink.nuban,
          requestType: form.reqtype,
          requestReason: form.reason,
          bvn: this.user.userBVN,
          testQuestion: form.testQuestion,
          testAnswer: form.testAnswer,
          secretAnswer: form.secretAnsw,
          authMode: 'TOKEN',
          authValue: form.token
        };
        body = this.util.addAuthParams(body);
        return this.http.post(PATH, body).pipe(
          retry(3),
          catchError(this.util.handleError)
        );
      }
    } else {
      this.router.navigate(['/onboarding/login']);
    }
  }

  // =========================== END REQUEST ========================

  // =================== CARD STATUS ==================

  getCardStatus(): Observable<any> {
    const PATH = this.RequestServiceURL + `/CardStatus`;
    let body: any = {
      cardHistory: 1
    };
    body = this.util.addAuthParams(body);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getCardStatusData() {
    this.getCardStatus().subscribe(
      res => {
        console.log(res);
        if (res.responseCode === '00') {
          for (const r of res.cards) {
            if (r.pan) {
              r.panLast4Digit = r.pan.slice(12, 16);
              r.editedPan = r.pan.match(/.{1,4}/g).join('   ');
            }
          }
          console.log('CARDS:' + JSON.stringify(res.cards));
          this.updateCardsError('');
          this.updateCards(res.cards);
          this.updateSelectedCard(res.cards[0]);
        } else {
          this.updateCardsError(this.util.handleResponseError(res));
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateCardsError(err);
      }
    );
  }

  updateCards(cards) {
    this.cardsSource.next(cards);
    console.log('cards updated:');
  }

  updateSelectedCard(card: Cards) {
    this.selectedCardSource.next(card);
    console.log('Selected cards updated:');
    this.statement.getAcctLinkedToCards(card.cardid);
  }

  updateCardsError(message) {
    this.cardsErrorSource.next(message);
    console.log(message);
  }

  // =========================== END CARD STATUS ========================

  // ================= CARD HOTLIST =========================
  cardHotlisting(reqBody) {
    const PATH = this.RequestServiceURL + `/CardHotlist`;
    reqBody = this.util.addAuthParams(reqBody);
    reqBody.AuthValue = reqBody.AuthValue.toString();
    delete reqBody.customerNumber;
    console.log(reqBody);
    return this.http.post(PATH, reqBody).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // =================== VIRTUAL CARD REQUEST ===========================
  virtualCardRequest(acctNo) {
    const PATH = this.RequestServiceURL + `/GetVirtualCard`;
    let body = {
      customerAcctNo: '',
      customerNumber: ''
    };
    body.customerAcctNo = acctNo;
    body = this.util.addAuthParams(body);
    delete body.customerNumber;
    console.log(body);
    console.log(PATH);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // ================= VIEW INTERNATIONAL SPEND LIMIT =========================
  InternationalSpendLimit(acctNo) {
    const PATH = this.RequestServiceURL + `/View-Intl-SpendLimit`;
    let body = {};
    body = this.util.addAuthParams(body);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getRetrievedPin(Body) {
    const PATH = this.RequestServiceURL + `/PinRetrieval`;
    let body = {
      pan: Body.pan,
      nubanAccount: Body.nubanAccount,
      authMode: Body.authMode,
      authValue: Body.authValue,
      secretAnswer: Body.secretAnswer,
    };
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // ========================== VIEW BLOCKED FUNDS ======================

  getBlockedFunds(reqBody) {
    const PATH = this.AuxServicesURL + `/ViewCARDBlockedFunds`;
    let body = {
      CustomerIdentifier: reqBody.acct,
      CustomerIdentifierType: reqBody.type
    };
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // ========================== CARD PROTECT ======================

  getCardProtectStatus(): Observable<any> {
    const PATH = this.RequestServiceURL + `/Get-Card-Status`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getCardProtectStatusData() {
    this.getCardProtectStatus().subscribe(
      res => {
        console.log(res);
        if (res.responseCode === '00') {
          console.log('CARDS Protect status:' + JSON.stringify(res.cardStatus));
          this.updateCardProtectStatus(res.cardStatus);
        } else {
          this.updateCardProtectError(this.util.handleResponseError(res));
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateCardProtectError(err);
      }
    );
  }

  updateCardProtectStatus(status) {
    this.cardProtectStatusSource.next(status);
    console.log('Card Protect Status updated:');
  }

  updateCardProtectError(message) {
    this.cardProtectErrorSource.next(message);
    console.log(message);
  }

  // =================== ENABLE OR DISABLE CHANNEL ==================

  enableDisableChannel(body: any): Observable<any> {
    const PATH = this.getCardProtectPath(body.channel);
    let reqBody: any = {
      enableChannel: body.status,
      selectedCountries: '',
      enabledCountries: '',
      tokenValue: body.token.toString()
    };
    reqBody = this.util.addAuthParams(reqBody);
    delete reqBody.customerNumber;
    console.log(reqBody);
    return this.http.post(PATH, reqBody).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getCardProtectPath(channel) {
    let PATH = '';
    switch (channel) {
      case 'all':
        PATH = this.RequestServiceURL + `/Enable-Disable-All`;
        break;
      case 'web':
        PATH = this.RequestServiceURL + `/Enable-Disable-Web`;
        break;
      case 'pos':
        PATH = this.RequestServiceURL + `/Enable-Disable-Atm-Pos`;
        break;
      case 'local':
        PATH = this.RequestServiceURL + `/Enable-Disable-Local`;
        break;
      case 'international':
        PATH = this.RequestServiceURL + `/Enable-Disable-International`;
        break;
      default:
        break;
    }
    return PATH;
  }

  // =================== ACCOUNT LINKING AND DELINKING ==================

  accountLinkingDelinking(Body) {
    const PATH = this.AuxServicesURL + `/CardLinking`;
    let body = {
      LinkType: Body.linkType,
      AccountType: Body.acctType, // 10-savings,20-Current.
      PANLASTFOURDIGIT: Body.fourDigit,
      CustomerIdentifier: Body.nuban,
      AuthValue: Body.authValue,
      SecretAnswer: Body.secretAnswer,
      CustomerIdentifierType: '0', // 0-Nuban,1-Bvn,2-Mobile,3-Email,4-CustomerNumber,5-Fullacct
      Amount: '0',
      AuthType: '0' // 0-Token,1-Pin,2-UssdPin
    };
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }
}
