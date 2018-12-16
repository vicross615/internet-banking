import { Injectable, OnDestroy } from '@angular/core';
import { AccountStatement } from '../_model/accounts.model';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { AcctDetailsService } from '../acct-details/acct-details.service';
import { retry, catchError } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Injectable({
  providedIn: 'root'
})
export class AccountStatementService implements OnDestroy {
  // Observable string source and stream
  private AccountStatementSource = new Subject<AccountStatement[]>();
  AccountStatement$ = this. AccountStatementSource.asObservable();
  private AccountStatementErrorSource = new Subject<string>();
  AccountStatementError$ = this. AccountStatementErrorSource.asObservable();
  // API parameters definition
  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;
  testbody = '';

  constructor(
    private http: HttpClient,
    public util: UtilitiesService,
    public AcctsServices: AcctDetailsService
  ) { 
    
  }

  // ================ DOWNLOAD STATEMENT ==========================

  downloadStatement(reqBody) {
    const PATH = this.REQ_URL + `/GenerateStatement`;
    reqBody = this.util.addAuthParams(reqBody);
    console.log(reqBody);
    return this.http.post(PATH, reqBody)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }


  // =============== GENERATE RECEIPT =================================

  generateReceipt(reqBody) {
    const PATH = this.REQ_URL + `/GenerateReceipt`;
    reqBody = this.util.addAuthParams(reqBody);
    console.log(reqBody);
    return this.http.post(PATH, reqBody)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  ngOnDestroy(): void {

  }

  getStatement(reqBody) {
    const PATH = this.CUST_URL + `/TransactionHistory`;
    let body = {
      'accountNumber': reqBody.accountNumber,
      'historyType': reqBody.historyType,
      'startDate': reqBody.startDate,
      'stopDate': reqBody.stopDate,
      'count': reqBody.count,
      'amount': reqBody.amount,
      'remarks': reqBody.remarks
    };
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post(PATH, body)
    .pipe(
      untilComponentDestroyed(this),
      retry(3),
      catchError(this.util.handleError)
    )
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.updateAccountStatement(res.histDetails);
          this.updateAccountStatementError(null);
        } else {
          this.updateAccountStatement(null);
          this.updateAccountStatementError(this.util.handleResponseError(res));
          console.log('An Error Occurred ' + res.responseDescription);
        }

      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateAccountStatementError('We are sorry. Our service is currently down');
      }
    );

  }

  updateAccountStatement(statement) {
    this.AccountStatementSource.next(statement);
    console.log('Statement updated:');
  }

  updateAccountStatementError(message) {
    this.AccountStatementErrorSource.next(message);
    console.log(message);
  }
}
