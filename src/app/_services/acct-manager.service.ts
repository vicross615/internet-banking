import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { AcctManager, StaffPicture, StaffDetails, AcctMngrResponse } from '../_models/account-manager';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { UtilitiesService } from './utilities.service';
import { retry, catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AcctManagerService {

  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;

  // move to component
  private user: User;
  public acctMngrDetail: AcctManager;
  public MngrDetails: StaffDetails;
  public picture: StaffPicture;
  // move to component

  constructor(private http: HttpClient, private util: UtilitiesService) { }

  getAcctManagerDetails() {
    const PATH = this.CUST_URL + `/AccountManagerDetails`;

    let body = {};
    body = this.util.addAuthParams(body);
    console.log('Account Manager data: ' + JSON.stringify(body));
    return this.http.post<AcctMngrResponse>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );

  }

  rateAccountManager(reqBody) {
    const PATH = this.CUST_URL + `/RateAccountOfficer`;

    let body = {

      'Rating': reqBody.Rating,
      'AcctOfficerUsername': reqBody.AcctOfficerUsername,
      'Comment': reqBody.comment,
      'AccountMgrTeam': reqBody.AccountMgrTeam,
    };

    body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post<AcctMngrResponse>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }


  accountManagerListinBranch(reqBody) {
    const PATH = this.CUST_URL + `/AcctManagersInBranchWithDetails`;
    let body: any = {};
     body = {
      'AcctMgrId': reqBody.AcctMgrId,
      'BranchCode': reqBody.BranchCode,
    };
    body = this.util.addAuthParams(body);
   // body.userId = reqBody.UserId;
   // body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post<AcctMngrResponse>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }

  switchAccountManager(reqBody) {
    const PATH = this.CUST_URL + `/UpdateAccountOfficer`;
    let body: any = {};
    body = {
      'OldAcctMgrID': reqBody.OldAcctMgrID,
      'NewAcctMgrID': reqBody.NewAcctMgrID,
      'Reason': reqBody.comment,
      'OldAcctMgrName': reqBody.OldAcctMgrName,
      'NewAcctMgrName': reqBody.NewAcctMgrName,
    };
    body = this.util.addAuthParams(body);
    //body.userId = reqBody.UserId;
   //body = this.util.addAuthParams(body);
    console.log(body);
    return this.http.post<AcctMngrResponse>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }

}
