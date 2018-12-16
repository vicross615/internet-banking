import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { retry, catchError } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Injectable({
  providedIn: 'root'
})
export class CardStatementService implements OnDestroy {
  private RequestServiceURL = environment.BASE_URL + environment.REQ_SERV;
  private CustomerServiceURL = environment.BASE_URL + environment.CUST_SERV;
  // Observable string sources: Account Linked To Cards
  private cardsAcctSource = new BehaviorSubject<any[]>([]);
  private cardsAcctErrorSource = new BehaviorSubject<string>(null);
  // Observable string streams: Account Linked To Cards
  cardsAcct$ = this.cardsAcctSource.asObservable();
  cardsAcctError$ = this.cardsAcctErrorSource.asObservable();

  // Observable string sources: Card Statement
  private cardStatementSource = new BehaviorSubject<any[]>([]);
  private cardStatementErrorSource = new BehaviorSubject<string>(null);
  // Observable string streams: Card Statement
  cardStatement$ = this.cardStatementSource.asObservable();
  cardStatementError$ = this.cardStatementErrorSource.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService
  ) { }

  ngOnDestroy(): void {

  }

  // =============== Account Linked to Cards ===================
  acctLinkedToCards(reqBody): Observable<any> {
    const PATH = this.RequestServiceURL + `/AccountLinkedWithCard`;
    console.log('t');
    let body: any = {
      card_ID: reqBody
    };
    body = this.util.addAuthParams(body);
    return this.http.post(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  updateCardsAcct(accts) {
    this.cardsAcctSource.next(accts);
    console.log('cards Account updated:');
  }

  updateCardsAcctError(message) {
    this.cardsAcctErrorSource.next(message);
    console.log(message);
  }

  getAcctLinkedToCards(reqBody: any) {
    this.acctLinkedToCards(reqBody).pipe(untilComponentDestroyed(this))
    .subscribe(
      res => {
        if (res.responseCode === '00') {
          console.log('CARDS Accounts:' + JSON.stringify(res.cardsAccount));
          this.updateCardsAcct(res.cardsAccount);
        } else {
          this.updateCardsAcctError(res.responseDescription);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateCardStatementError(err);
      }
    );
  }

  // =========================== CARD STATEMENT/ CARD TRANSACTION HISTORY =========================

  getCardStatement(reqBody: any): Observable<any> {
    const PATH = this.CustomerServiceURL + `/CardTransactionHistory`;
      let body = {
        cardAccountNumber: reqBody.cardAccountNumber,
        maskedPAN: reqBody.maskedPAN,
        historyType: reqBody.historyType,
        status: reqBody.status,
        startDate: reqBody.startDate,
        stopDate: reqBody.stopDate,
        count: reqBody.count,
        amount: reqBody.amount,
        remarks: reqBody.remarks
      };
      body = this.util.addAuthParams(body);
      console.log(body);
      return this.http.post(PATH, body).pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getCardStatementData(reqBody: any) {
    this.getCardStatement(reqBody).pipe(untilComponentDestroyed(this))
    .subscribe(
      res => {
        if (res.responseCode === '00') {
          console.log('CARDS STATEMENT:' + JSON.stringify(res.cardHistDetails));
          this.updateCardStatement(res.cardHistDetails);
        } else {
          this.updateCardStatementError(res.responseDescription);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateCardStatementError(err);
      }
    );
  }

  updateCardStatement(cardStatement) {
    this.cardStatementSource.next(cardStatement);
    console.log('cardStatement updated:');
  }

  updateCardStatementError(message) {
    this.cardStatementErrorSource.next(message);
    console.log(message);
  }


}
