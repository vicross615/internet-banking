import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { UtilitiesService } from '../../_services/utilities.service';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FreqBeneficiaries } from '../_customer-model/customer.model';
import { User } from '../../_models/user';

@Injectable({providedIn: 'root'})
export class FxService {
  user: User = JSON.parse(localStorage.getItem('userDetails'));

  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;
  private TRANSF_URL = environment.BASE_URL + environment.TRANSF_SERV;
  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  private AUX_URL = environment.AUX_BENEFICIARY;

  private freqBeneficiaries = new BehaviorSubject<FreqBeneficiaries[]>(null);
  freqBeneficiariesCast = this.freqBeneficiaries.asObservable();
  public selectedfreqBeneficiary = new BehaviorSubject<FreqBeneficiaries>(null);
  selectedfreqBeneficiaryCast = this.selectedfreqBeneficiary.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router
  ) { }

  otherBankFXTransfer(body) {
    const PATH = this.TRANSF_URL + `/FXTransfer`;
    delete body.beneName;
    delete body.amount;
    body.customerType = this.user.customerType;
    body = this.util.addAuthParams(body);
    console.log(JSON.stringify(body)); // for debugging only
    return this.http.post<Response>(PATH, body)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  acctTodebitForChargeFX(curCode) {
    const PATH = this.CUST_URL + `/GetAccountToDebitChargeFx`;
    let body = {
      'CurrencyCode': curCode,
    };
    body = this.util.addAuthParams(body);
    console.log(JSON.stringify(body)); // for debugging only
    return this.http.post<Response>(PATH, body)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

}
