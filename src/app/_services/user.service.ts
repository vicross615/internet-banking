import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { retry } from 'rxjs/operators';
import { User } from '../_models/user';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  public today = Date();
  randomNumber: any;

  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  private Req_URL = environment.BASE_URL + environment.REQ_SERV;
  // Observable string sources: user
  private userDetailSource = new BehaviorSubject<any[]>(null);
  private userErrorSource = new BehaviorSubject<any[]>(null);
  // Observable string streams: user
  userDetail$ = this.userDetailSource.asObservable();
  userError$ = this.userErrorSource.asObservable();
  // Customer Details Observable
  private customerDetailsSource = new Subject<CustomerInformation>();
  customerDetailsObserver = this.customerDetailsSource.asObservable();
   // Customer Details Observable
   private fullCustomerDetailsSource = new Subject<CustomerInformation>();
   fullCustomerDetailsObserver = this.fullCustomerDetailsSource.asObservable();

  constructor(private http: HttpClient) {}

  updateUser(user) {
    this.userDetailSource.next(user);
  }

  updateUserError(error) {
    this.userErrorSource.next(error);
  }

  getUserDetails(): User {
    let userDetails = null;
    this.userDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(user => (userDetails = user));
    if (!userDetails) {
      userDetails = JSON.parse(localStorage.getItem('userDetails'));
    }
    return userDetails;
  }

  get MoreUserDetails() {
    const PATH = this.CUST_URL + `/CustomerValidationMoreRecord`;
    const user = this.getUserDetails();
    const body = {
      // Add customer related properties to the body object
      email: user.email,
      phoneNumber: '',
      bvn: user.userBVN,
      category: 1,
      requestId: this.generateRequestId,
      channel: environment.CHANNEL,
      userId: user.userId,
      customerNumber: user.userId,
      sessionId: localStorage.getItem('userToken')
    };
    return this.http.post<Response>(PATH, body).pipe(retry(3));
  }
  userDetailsData() {
    this.MoreUserDetails.pipe(untilComponentDestroyed(this))
    .subscribe((response: any) => {
      const customerDetails = response;
      this.customerDetailsSource.next(customerDetails);
    });
  }
  fullUserDetails(acctno) {
    const PATH = this.Req_URL + `/FullCustomerDetails`;
    const user = this.getUserDetails();
    const body = {
      // Add customer related properties to the body object
      acctno: acctno,
      customerId: user.userId,
      requestId: this.generateRequestId,
      channel: environment.CHANNEL,
      userId: user.userId,
      sessionId: localStorage.getItem('userToken')
    };
    return this.http.post<Response>(PATH, body).pipe(retry(3));
  }
  fullUserDetailsData(acctno) {
    this.fullUserDetails(acctno).pipe(untilComponentDestroyed(this))
    .subscribe((response: any) => {
      const customerDetails = response;
      this.fullCustomerDetailsSource.next(customerDetails);
    });
  }
   // Duplicated this from utilities to avoid Angular Cli 'Circular imports' issues.
  get generateRequestId() {
    let reqID = '';
    const user = this.getUserDetails();
    reqID = environment.CHANNEL_SHORTNAME + this.today + user.userId;
    return reqID;
  }

  ngOnDestroy(): void {

  }
}

export interface CustomerInformation {
  birthday: string;
  bvn: string;
  customerNumber: string;
  customerSegment: string;
  customerType: string;
  email: string;
  gender: string;
  name: string;
  phone: string;
  residentialAddress: string;
}


