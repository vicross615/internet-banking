import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { Router } from '@angular/router';
import { Subject, Observable,BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {BankName} from './dispense-error.model'



@Injectable({ providedIn: "root" })
export class DispenseErrorService {
  private RequestServiceURL = environment.BASE_URL + environment.REQ_SERV;
  private CustomerServiceURL = environment.BASE_URL + environment.CUST_SERV;

  private bankName = new BehaviorSubject<BankName[]>([]);

   banks$ = this.bankName.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router
  ) { }



  getCardTransactions(reqBody): Observable<any> {

    const PATH = this.RequestServiceURL + `/Dispense-Error-Get-Transactions`;

    let body = {
      'transactionDate': reqBody.transactionDate,
      'accountNumber': reqBody.acctToDebit,
      'card': reqBody.pan,
    };
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }

  getBanknamesfordispenseError(): Observable<any> {
    const PATH = this.RequestServiceURL + `/Dispense-Error-Get-Location`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }

  // create an observable to hold list of banks/location

  getAcctToDipErrorLocation() {
    this.getBanknamesfordispenseError()
      .subscribe(
        (res: any) => {
          console.log(res); // Delete this 
          if (res.responseCode === '00'){
            console.log(res.serv)
            this.updateBankName(res.serv);        
          } else {
            console.log(res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }

  updateBankName(BankName) {
    this.bankName.next(BankName);
  }

   //acctToDebitSource
  logDispenseErrorTransaction(reqBody): Observable<any> {
    const PATH = this.RequestServiceURL + `/Log-Transactions`;
    let body = {
      'transactionDate': reqBody.transactionDate,
      'accountNumber': reqBody.acctToDebit,
      'card': reqBody.pan,
      'bankName': reqBody.bankName,
      'pan': reqBody.pan,
      'TransactionRemark': reqBody.TransactionRemark,
      'doc_Num': reqBody.doc_Num,
      'transactionAmount': reqBody.transactionAmount,
    };
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }
}