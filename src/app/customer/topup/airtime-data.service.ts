import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../_services/utilities.service';
import { Subject, throwError, Observable, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { UserService } from '../../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AirtimeDataService implements OnDestroy {
  user: any;
  SERVICE_API_URL = environment.AUX_URL;
  // Observable string streams: Product Details
  productDetailsSource = new Subject<any[]>();
  productDetailsService = this.productDetailsSource.asObservable();
  // Observable string streams: Repeat Transfer
  storeForRecentAirTimeFormValues = new BehaviorSubject<any>(null);
  formValuesForFrequentTopUp = this.storeForRecentAirTimeFormValues.asObservable();
  // Observable streams: History
  recentTransferSource = new Subject<any>();
  recentTransferObservable: any = this.recentTransferSource.asObservable();
  nameOFActiveAirtimeModuleForRecentTrnsfer = new BehaviorSubject<any>(null);
  nameofActiveAirtimeCompIS = this.nameOFActiveAirtimeModuleForRecentTrnsfer.asObservable();
  // Subscribe to Frequent Transfers Comp Events
  private _toggle = new Subject();
  toggle$ = this._toggle.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private userService: UserService
  ) {

  }

  ngOnDestroy(): void {}

  toggle(todo) {
    this._toggle.next(todo);
  }

  airtimeAndDataPurchase(form: any) {
    this.user = this.userService.getUserDetails();
    const PATH = this.SERVICE_API_URL + '/Clickatell';
    if (form.reqtype === '0') {
      let body: any = {
        ProductID: form.productdetails.productid,
        UtilityName: form.productdetails.productname,
        transactionOwner: '0',
        Amount: form.airtimeamount,
        CustomerMobileToCredit: form.number,
        AccountToCharge: form.acctToDebit.nuban,
        transactionTypes: '0',
        CustomerIdentifier: form.acctToDebit.nuban,
        CustomerIdentifierType: '0',
        AuthType: 0,
        AuthValue: form.token,
        SecretAnswer: form.secretAnsw
      };
      body = this.util.addAuthParams(body);
      delete body.customerId;
      delete body.customerNumber;
      return this.http.post(PATH, body).pipe(
        retry(3),
        catchError(this.handleError)
      );
    }
    if (form.reqtype === '1') {
      let body: any = {
        ProductID: form.selectedbundle.productid,
        UtilityName: form.selectedbundle.productname,
        transactionOwner: '0',
        Amount: form.selectedbundle.price,
        CustomerMobileToCredit: form.number,
        AccountToCharge: form.acctToDebit.nuban,
        transactionTypes: '0',
        CustomerIdentifier: form.acctToDebit.nuban,
        CustomerIdentifierType: '0',
        AuthType: 0,
        AuthValue: form.token,
        SecretAnswer: form.secretAnsw
      };
      body = this.util.addAuthParams(body);
      delete body.customerId;
      delete body.customerNumber;
      return this.http.post(PATH, body).pipe(
        retry(3),
        catchError(this.util.handleError)
      );
    }
  }
  // Return product details, 0 For Airtime and 1 for Data
  productDetails(transtype) {
    const PRODUCT_DETAILS =
      environment.AUX_URL + '/Clickatell?mobileTransactionType=';
    const PATH = PRODUCT_DETAILS + transtype;
    return this.http.get(PATH).pipe(catchError(this.handleError));
  }
  // Push data to Observable
  set productDetailsForAirtimePurchase(type) {
    this.productDetails(type).subscribe((response: any) => {
      this.productDetailsSource.next(response);
    });
  }
  // Get the current users recent transfers from clickatell API
  getrecentTopUP() {
    this.user = this.userService.getUserDetails();
    const PATH = environment.AUX_URL + '/Clickatell?UserID=' + this.user.userId;
    return this.http.get(PATH).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  // Initialize the Observable we created for this service with DataCue.
  initializeRecentTransfersDataStream() {
    this.getrecentTopUP().subscribe((data: any) => {
      console.log('return' + JSON.stringify(data));
      const d = data.TOPAIRTIMEUSERIDProp.TopuserAirtime;
      if (d.length === 0) {
        this.recentTransferSource.next([]);
      } else {
        this.recentTransferSource.next(data.TOPAIRTIMEUSERIDProp.TopuserAirtime);
      }

    });
  }
  set storeValuesToObserble(form) {
    // Save the form values to an observable
    this.storeForRecentAirTimeFormValues.next(form);
  }
  set activeAirtimeName(val: any) {
    // store the name
    this.nameOFActiveAirtimeModuleForRecentTrnsfer.next(val);
  }
  // Custom errorHandling for the module
  handleError(error?: HttpErrorResponse) {
    console.log(error);
    let errormessage;
    if (error.error instanceof ErrorEvent) {
      console.error(error);
      errormessage = `Network Error ${error.error.message}`;
    } else {
      console.error(error);
      errormessage = `${JSON.stringify(error.error.responseDescription)}`;
      console.log(errormessage);
    }
    console.log(errormessage);
    return throwError(`${errormessage.slice(errormessage.indexOf('-') + 1)}`);
  }
}
