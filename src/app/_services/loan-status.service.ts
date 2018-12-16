import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { User } from '../_models/user';
import { Subject} from 'rxjs';
import { UserService } from './user.service';
import { CustomerService } from '../customer/_customer-service/customer.service';
import { AcctToDebit, AcctDetails } from '../../app/customer/_customer-model/customer.model';

@Injectable(
    {providedIn: 'root'
})

export class LoanStatusService {
  public AUTH_URL = environment.BASE_URL + environment.CUST_SERV;

  constructor(
    private http: HttpClient,
    public util: UtilitiesService,
    private userService: UserService,
    private customerDetails: CustomerService) { }

  getLoanStatus(body): Observable<any> {

    const PATH = this.AUTH_URL + `/GetLoanStatusRequests`;

    let reqBody = {
      'accountNumber': body.accountNumber,
      'endDate': body.endDate,
      'startDate': body.startDate,
    };
    reqBody = this.util.addAuthParams(reqBody);
    console.log(reqBody); // for debugging only
    return this.http.post<Response>(PATH, reqBody).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }


}
