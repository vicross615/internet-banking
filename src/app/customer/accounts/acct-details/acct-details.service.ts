import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { catchError, retry } from 'rxjs/operators';
import { User } from '../../../_models/user';
import { UtilitiesService } from '../../../_services/utilities.service';
import { environment } from '../../../../environments/environment';
import { AcctDetails } from '../../_customer-model/customer.model';





@Injectable({providedIn: 'root'})
export class AcctDetailsService {

  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  user: User;
  selectedAccount: AcctDetails;
  accountsList: AcctDetails[];
  public data = null;

  constructor(private http: HttpClient, public util: UtilitiesService) { }

  getAccountsList() {
    const PATH = this.CUST_URL + `/BalanceEnquiry`;
    this.user = JSON.parse(localStorage.getItem('userDetails'));
    if (this.user) {
      const userID = this.user.userId;
      const reqID = this.util.generateRequestId();
      const data = {
        'RequestID' : reqID,
        'UserId': userID,
        'CustomerNumber': userID,
        'SessionId': localStorage.getItem('userToken'),
        'Channel': environment.CHANNEL
      };
      console.log(data);
      return this.http.post<Response>(PATH, data)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
    } else {
      console.error('Session is expired, please Login');
    }

  }




}
