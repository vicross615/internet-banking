import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { environment } from '../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { throwError as _throw, throwError, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { retry, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { CurrencyPipe } from '@angular/common';
import * as JsEncryptModule from 'jsencrypt';
// tslint:disable-next-line:prefer-const
declare var Date: any;
@Injectable({ providedIn: 'root' })
export class UtilitiesService {
  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;
  private CUS_URL = environment.BASE_URL + environment.CUST_SERV;
  public today = Date().replace(/[a-zA-Z]|\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  randomNumber: any;
  user: any;
     // Observable: Investments Stattus
     private chargesSource = new Subject<any>();
     charges$ = this.chargesSource.asObservable();
     private chargesErrorSource = new Subject<string>();
     chargesError$ = this.chargesErrorSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private notifications: NotificationsService,
    private userService: UserService,
    private cp: CurrencyPipe
  ) { }

  decrypt(hash) {
    const decrypt = new JsEncryptModule.JSEncrypt();
    decrypt.setPrivateKey(environment.PRIV_ENC_KEY);
    const data = decrypt.decrypt(hash);
    return data;
  }

  encrypt(data) {
    console.log('encrypting: ' + data);
    const encrypt = new JsEncryptModule.JSEncrypt();
    encrypt.setPublicKey(environment.PUB_ENC_KEY);
    const hash = encrypt.encrypt(data);
    return hash;
  }

  extEncrypt(data) {
    console.log('encrypting: ' + data);
    const encrypt = new JsEncryptModule.JSEncrypt();
    encrypt.setPublicKey(environment.PUB_IBANK_ENC_KEY);
    const hash = encrypt.encrypt(data);
    return hash;
  }

  getAuthDetails() {
    this.user = this.userService.getUserDetails();
    console.log(this.user);
  }

  generateRequestId() {
    let reqID = '';
    this.user = this.userService.getUserDetails();
    if (this.user) {
      reqID = environment.CHANNEL_SHORTNAME + this.today + this.user.userId;
    } else {
      reqID = this.generateNumber();
    }
    return reqID;
  }

  generateNumber() {
    this.randomNumber = null;
    this.randomNumber =
      environment.CHANNEL_SHORTNAME +
      this.today +
      Math.floor(Math.random() * (999999999 - 10000000 + 1) + 10000000);
    return this.randomNumber;
  }

  addAuthParams(body) {
    this.user = this.userService.getUserDetails();
    console.log(this.user);
    if (this.user) {
      body.customerId = this.user.userId;
      body.customerNumber = this.user.userId;
      body.requestId = this.generateRequestId();
      body.channel = environment.CHANNEL;
      body.userId = this.user.userId;
      body.sessionId = localStorage.getItem('userToken');
    } else {
      console.log('Session is Expired');
      this.notifications.html(`Your session has expired`, 'info', {
        id: 'login',
        timeOut: 10000,
        showProgressBar: true,
        animate: 'scale'
      });
      setTimeout(() => {
        this.router.navigate(['/onboarding/login']);
      }, 5000);
    }
    return body;
  }

  handleError(error?: HttpErrorResponse) {
    console.log(error);
    let errormessage;
    if (error.error instanceof ErrorEvent) {
      console.error('Network Error', error.error.message);
      errormessage = `Network Error ${error.error.message}`;
      console.log(errormessage);
    } else {
      console.error(`Backend returned code ${error.status},` + `body was: ${JSON.stringify(error.error.responseDescription)}`);
      if (error.statusText === 'Unknown Error') {
        errormessage = 'Opps! We are sorry. Our service is currently down. Please try *737# or use our GT Mobile app.';
      }
      errormessage = `${error.error.responseDescription || errormessage}`;
      console.log(errormessage);
    }
    console.log(errormessage);
    return throwError(`${errormessage.slice(errormessage.indexOf('-') + 1)}`);
  }

  handleResponseError(res) {
    let message = res.responseDescription;
    switch (res.responseCode) {
      case '01':
        {
          message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        }
        break;

      case '96':
        {
          message = (message) ? message.slice(message.indexOf('-') + 1) : '';
          console.log(message);
        }
        break;

      case '03':
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;

      case '38':
        {
          message = message.slice(message.indexOf('-') + 1);
          console.log('logout Successful');
          this.notifications.html(`Your session has expired`, 'info', {
            id: 'login',
            timeOut: 10000,
            showProgressBar: true,
            animate: 'scale'
          });
          setTimeout(() => {
            this.router.navigate(['/onboarding/login']);
          }, 5000);
        }
        break;

      case '25':
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;

      case '99':
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;

      default:
        message = (message) ? message.slice(message.indexOf('-') + 1) : '';
        break;
    }

    return message;
  }

  // ====================== FORM UTILITIES =====================

  form_utilities(endpoint: string) {
    const PATH = this.REQ_URL + endpoint;
    let body = {};
    body = this.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(6),
      catchError(this.handleError)
    );
  }

  statesService(country_code: string) {
    const PATH = this.REQ_URL + '/GetStates';
    let body = { countryCode: country_code };
    body = this.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(6),
      catchError(this.handleError)
    );
  }

  LGA(state_code: string) {
    const PATH = this.REQ_URL + '/GetLGA';
    const body = {
      stateCode: state_code,
      requestId: this.generateRequestId(),
      channel: environment.CHANNEL,
      userId: this.user.userId,
      customerId: this.user.userId,
      sessionId: localStorage.getItem('userToken')
    };
    console.log(body);
    return this.http.post<any>(PATH, body).pipe(
      retry(6),
      catchError(this.handleError)
    );
  }

  employment_Status() {
    const PATH = this.REQ_URL + '/GetEmploymentStatus';
    let body = { customerId: this.user.userId };
    body = this.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  formatDate(dateObj) {
    let newFormat: any = '';
    if (dateObj) {
      console.log('datttee' + dateObj);
      dateObj.day = this.addzero(dateObj.day);
      dateObj.month = this.addzero(dateObj.month);
      newFormat = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
      console.log(newFormat);
    }
    console.log(newFormat);
    return newFormat;
  }

  formatDatewithSlash(dateObj) {
    let newFormat: any = '';
    if (dateObj) {
      console.log('datttee' + dateObj);
      dateObj.day = this.addzero(dateObj.day);
      dateObj.month = this.addzero(dateObj.month);
      newFormat = `${dateObj.year}/${dateObj.month}/${dateObj.day}`;
      console.log(newFormat);
    }
    console.log(newFormat);
    return newFormat;
  }

  addzero(value) {
    let formated = value.toString();
    if (formated.length === 1) {
      formated = '0' + value;
    }
    return formated;
  }
  // Function to Find Invalid Form Controls
  public findInvalidControls(formGroupName) {
    const invalid = [];
    const controls = formGroupName.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  formatCurrency(controls) {
    let formatedValue = controls.value;
    formatedValue = (formatedValue) ? formatedValue.replace(/[^0-9.]/g, '') : formatedValue; // (/[\D\s\_\-]+/g, '');
    // formatedValue = formatedValue ? parseFloat((Math.round(formatedValue * 100) / 100).toFixed(2)) : 0;
    formatedValue = (formatedValue) ? formatedValue.toLocaleString( 'en-US' ) : formatedValue;
    // formatedValue = formatedValue ? parseFloat((Math.round(formatedValue * 100) / 100).toFixed(2)) : 0;
    // formatedValue = (formatedValue.length > 6) ? this.cp.transform(formatedValue) : formatedValue;
    controls.setValue(formatedValue);
  }

  getCharges(acct, type): Observable<any> {
    const PATH = this.CUS_URL + `/GetCharges`;
    let body: any = {};
    body.accountToDebit = acct;
    body.chargeType = type;
    body = this.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  async getChargesData(acct, type) {
    this.getCharges(acct, type).subscribe(
        res => {
          console.log(res);
          if (res.responseCode === '00') {
            this.updateCharges(res);
            this.updateChargesError(null);
          } else {
            this.updateCharges(null);
            this.updateChargesError(this.handleResponseError(res));
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateChargesError(err);
          this.updateCharges(null);
        }
      );
  }

  updateCharges(charges) {
    this.chargesSource.next(charges);
  }

  updateChargesError(message) {
    this.chargesErrorSource.next(message);
  }
}
