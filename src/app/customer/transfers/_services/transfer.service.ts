import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilitiesService } from '../../../_services/utilities.service';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FreqBeneficiaries } from '../../_customer-model/customer.model';
import { User } from '../../../_models/user';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Injectable({ providedIn: 'root' })
export class TransferService implements OnDestroy {
  eligibleAmt: any;
  user: User = JSON.parse(localStorage.getItem('userDetails'));
  resBody: string;

  private TRANSF_URL = environment.BASE_URL + environment.TRANSF_SERV;
  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  private AUX_URL = environment.AUX_URL;

  private freqBeneficiaries = new BehaviorSubject<FreqBeneficiaries[]>(null);
  freqBeneficiaries$ = this.freqBeneficiaries.asObservable();
  public selectedfreqBeneficiary = new BehaviorSubject<FreqBeneficiaries>(null);
  selectedfreqBeneficiary$ = this.selectedfreqBeneficiary.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router
  ) { }

  ngOnDestroy(): void {

  }

  getFreqBeneficiaries(type): Observable<any> {
    const PATH = this.TRANSF_URL + `/MostFrequentTransfers`;
    let body: any = {};
    body.type = type;
    body = this.util.addAuthParams(body);
    delete body.customerNumber;
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  updateFreqBeneficiaries(selected) {
    this.freqBeneficiaries.next(selected);
  }

  updateSelectedFreqBeneficiary(selected) {
    this.selectedfreqBeneficiary.next(selected);
  }


  getTransferLimit(): Observable<any> {
    const PATH = this.TRANSF_URL + `/TransferLimit`;

    if (this.user) {
      const body = {
        'customerClass': this.user.customerType,
        'customerID': this.user.userId,
        'requestId': this.util.generateRequestId(),
        'channel': environment.CHANNEL,
        'userId': this.user.userId,
        'sessionId': localStorage.getItem('userToken')
      };
      console.log(body); // for debugging only
      return this.http.post<Response>(PATH, body)
        .pipe(
          retry(3),
          catchError(this.util.handleError)
        );
    } else {
      console.log('Error in Innitiate Transfer');
    }

  }

  intraTransfers(body) {
    const PATH = this.TRANSF_URL + `/IntraTransfer`;
    // Add customer related properties to the body object
    body.userType = 'USER';
    body.beneBankCode = '058';
    body.gtT_S2S_Withdrawal = '';
    body.customerClass = this.user.customerType;
    body.beneName = this.util.extEncrypt(body.beneName);
    body.amount = this.util.extEncrypt(body.amount);
    body.authMode = this.util.extEncrypt(body.authMode);
    body.authValue = this.util.extEncrypt(body.authValue);
    body = this.util.addAuthParams(body);
    body.customerId = this.util.extEncrypt(this.user.userId);
    body.customerNumber = this.util.extEncrypt(this.user.userId);
    body.userId = this.util.extEncrypt(body.userId);
    body.sessionId = this.util.extEncrypt(body.sessionId);
    body.requestId = this.util.extEncrypt(body.requestId);
    console.log(body); // for debugging only
    console.log('Request Params: ' + JSON.stringify(body));
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  interTransfers(body) {
    const PATH = this.TRANSF_URL + `/InterTransfer`;
    // Add customer related properties to the body object
    body.userType = 'USER';
    body.customerClass = this.user.customerType;
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  cardlessWithdrawal(body) {
    const PATH = this.AUX_URL + `/GTRESCUE`;
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }


  LoanEligibilityStatus(nuban, reqtype) {
    const PATH = this.CUST_URL + `/LoanEligibilityStatus`;
    let body = {
      'AccountNumber': nuban,
      'RequestType': reqtype
    };
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }


  manageBeneficiaryRequest(body) {
    const PATH = this.AUX_URL + `/Beneficiary`;
    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  manageBeneficiary(body) {
    this.manageBeneficiaryRequest(body)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
        (res: any) => {
          console.log(res); // Delete this
          if (res.responseCode === '00') {
            this.resBody = 'Successful';
          } else {
            this.resBody = 'Failed. Try again';
            const message = this.util.handleResponseError(res);
          }
        },
        (err: any) => {
          console.log(err);
          this.resBody = 'An error Occurred, Please try later.';
        }
      );
    console.log(this.resBody);
    return this.resBody;
  }


}
