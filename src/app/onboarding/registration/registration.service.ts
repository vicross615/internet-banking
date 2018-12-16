import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { environment } from '../../../environments/environment';
import { UtilitiesService } from '../../_services/utilities.service';
import { Subject } from 'rxjs/Subject';
import { User } from '../../_models/user';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  public AUTH_URL = environment.BASE_URL + environment.AUTH_API;
  public REQ_URL = environment.BASE_URL + environment.REQ_SERV;
  testbody = '';

  constructor(private http: HttpClient, public util: UtilitiesService) { }


  // ====================== REQUEST OTP =======================

  getOTP(nuban) {
    const PATH = this.REQ_URL + `/Send-otp`;
    const body: any = {};
    body.AccountNumber = nuban;
    body.requestId = this.util.generateRequestId();
    body.channel = environment.CHANNEL;
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }


  register(reqBody: any): Observable<any> {
    // const PATH = this.AUTH_URL + `/setup-withcard`;
    const PATH = this.REQ_URL + `/online-banking-details`;
    console.log(reqBody); // for debugging only
    reqBody.Channel = 'IBANK';
    reqBody.RequestId = this.util.generateNumber();
    console.log(reqBody);
    return this.http.post<Response>(PATH, reqBody)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }

  ForgotPassword(UserName, SecretAnswer): Observable<any> {
    const PATH = this.AUTH_URL + `/Forgot-Password`;
    // const user = JSON.parse(localStorage.getItem('userDetails'));
    const body = {
      'secretAnswer': SecretAnswer,
      'userId': UserName,
      'requestId': this.util.generateRequestId(),
      'channel': environment.CHANNEL,
      'customerId': UserName,
    };
    console.log(body); //for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }

  ForgotSecretAnswer(UserName): Observable<any> {
    const PATH = this.AUTH_URL + `/Forgot-Secret-Answer`;
    const body = {
      'userId': UserName,
      'requestId': this.util.generateRequestId(),
      'channel': environment.CHANNEL,
      'customerId': UserName,
    };
    console.log(body); // for debugging only
    this.testbody = this.util.encrypt(body);
    console.log(this.testbody);
    return this.http.post<Response>(PATH, body) 
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }
}
