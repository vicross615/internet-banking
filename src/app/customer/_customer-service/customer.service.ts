import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { UtilitiesService } from '../../_services/utilities.service';
import {
  AcctToDebit,
  AcctToDebitResponse,
  AcctToDebitFX,
  // AcctToDebitFXResponse,
  Beneficiaries,
  Beneficiary,
  Banks,
  PreRegBeneficiariesResponse,
  AcctDetails,
  FxBeneficiaries
} from '../_customer-model/customer.model';
import { Router } from '@angular/router';
import { LocalStorage } from '@ng-idle/core';
import { PreRegBeneficiaries } from '../_customer-model/customer.model';
import { UserService } from '../../_services/user.service';
import { BankBranches } from '../cards/card-replacement/card-replacement.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Injectable({ providedIn: 'root' })
export class CustomerService implements OnDestroy {
  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;

  // Observable string sources: Account Details
  private acctDetailSource = new BehaviorSubject<AcctDetails[]>(null);
  acctDetail$ = this.acctDetailSource.asObservable();
  private selectedAcctDetailSource = new BehaviorSubject<AcctDetails>(null);
  selectedAcctDetail$ = this.selectedAcctDetailSource.asObservable();
  private acctDetailErrorSource = new BehaviorSubject<string>(null);
  acctDetailError$ = this.acctDetailErrorSource.asObservable();
  // End Observable string streams: Account Details

  // Observable string sources: Account to debit
  private acctToDebitSource = new BehaviorSubject<AcctToDebit[]>([]);
  acctToDebit$ = this.acctToDebitSource.asObservable();
  private selectedAcctToDebitSource = new BehaviorSubject<AcctToDebit>({
    'accountBalance': '', 'accountName': '', 'fullAcctKey': '', 'nuban': ''
  });
  selectedAcctToDebit$ = this.selectedAcctToDebitSource.asObservable();
  private acctToDebitErrorSource = new BehaviorSubject<string>('Empty');
  acctToDebitError$ = this.acctToDebitErrorSource.asObservable();
  // End Observable string streams: Account to debit

  // Observable string sources: Account to debitFX added by Sola - 25/07/2018
  private acctToDebitFXSource = new BehaviorSubject<AcctToDebitFX[]>([]);
  acctToDebitFX$ = this.acctToDebitFXSource.asObservable();
  private selectedAcctToDebitFXSource = new BehaviorSubject<AcctToDebitFX>({
    'accountBalance': '', 'accountName': '', 'fullAcctKey': '', 'nuban': ''
  });
  selectedAcctToDebitFX$ = this.selectedAcctToDebitFXSource.asObservable();
  private acctToDebitFXErrorSource = new BehaviorSubject<string>('Empty');
  acctToDebitFXError$ = this.acctToDebitFXErrorSource.asObservable();
  // End Observable string streams: Account to debitFX

  // Observable string sources: Pre registered Beneficiaries
  private preRegBeneficiaries = new BehaviorSubject<Beneficiaries[]>(null);
  preRegBeneficiaries$ = this.preRegBeneficiaries.asObservable();
  private selectedPreRegBeneficiaries = new BehaviorSubject<Beneficiaries>(null);
  selectedPreRegBeneficiaries$ = this.selectedPreRegBeneficiaries.asObservable();
  private preRegBeneficiariesError = new BehaviorSubject<string>('Empty');
  preRegBeneficiariesError$ = this.preRegBeneficiariesError.asObservable();
  // End Observable string sources: Pre registered Beneficiaries

  // Observable string sources: Pre registered Beneficiaries
  private beneficiaries = new BehaviorSubject<Beneficiaries[]>(null);
  beneficiaries$ = this.beneficiaries.asObservable();
  private selectedBeneficiary = new BehaviorSubject<Beneficiaries>(null);
  selectedBeneficiaries$ = this.selectedBeneficiary.asObservable();
  private beneficiariesError = new BehaviorSubject<string>('Empty');
  beneficiariesError$ = this.beneficiariesError.asObservable();
  // Observable string sources: Pre registered Beneficiaries

  // Observable string sources: Banks
  private banks = new BehaviorSubject<Banks[]>(null);
  banks$ = this.banks.asObservable();
  private selectedBank = new BehaviorSubject<Banks>(null);
  selectedBank$ = this.selectedBank.asObservable();
  private banksError = new BehaviorSubject<string>('Empty');
  banksError$ = this.banksError.asObservable();
  // End Observable string sources: Banks

  // Branches, You can subscribe to this Observable for a list of Bank Branches
  private branchesSource = new Subject<any[]>();
  branchesObserver = this.branchesSource.asObservable();

  // Observable string sources: Pre registered Beneficiaries
  private fxbeneficiaries = new BehaviorSubject<FxBeneficiaries[]>(null);
  fxbeneficiaries$ = this.fxbeneficiaries.asObservable();
  private fxselectedBeneficiary = new BehaviorSubject<FxBeneficiaries>(null);
  fxselectedBeneficiaries$ = this.fxselectedBeneficiary.asObservable();
  private fxbeneficiariesError = new BehaviorSubject<string>('Empty');
  fxbeneficiariesError$ = this.fxbeneficiariesError.asObservable();
  subscription: Subscription;

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // =============== Service to GetBranches ===============
  get Branches() {
    const PATH = this.REQ_URL + `/GetBranches`;
    let body = { 'customerId': '', };
    body = this.util.addAuthParams(body);
    return this.http.post<BankBranches>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }
  getBranchesData() {
    this.Branches.pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.branchesSource.next(res.serv);
          } else {
            this.updateAcctToDebitError(res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }
  // =============== ACCT TO DEBIT ====================================
  // Query funtion that returns accounts from the API.
  getAcctToDebit(): Observable<any> {
    const PATH = this.CUST_URL + `/GetAccountToDebit`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getAcctToDebitData() {
    this.getAcctToDebit().pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: AcctToDebitResponse) => {
          console.log(res); // Delete this
          if (res.responseCode === '00') {
            this.updateAcctToDebitError('');
            this.updateAcctToDebit(res.acct);
            this.updateSelectedAcctToDebit(res.acct[0]);
          } else {
            this.updateAcctToDebitError(res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }

  updateAcctToDebit(accts) {
    this.acctToDebitSource.next(accts);
  }

  updateSelectedAcctToDebit(acct) {
    this.selectedAcctToDebitSource.next(acct);
  }

  updateAcctToDebitError(message) {
    this.acctToDebitErrorSource.next(message);
  }


  // =============== ACCT TO DEBITFX ====================================
  // Query funtion that returns accounts from the API. - added by Sola - 25/07/2018
  getAcctToDebitFX(): Observable<any> {
    const PATH = this.CUST_URL + `/GetAccountToDebitFX`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getAcctToDebitFXData() {
    this.getAcctToDebitFX().pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: AcctToDebitResponse) => {
          console.log(res); // Delete this
          if (res.responseCode === '00') {
            this.updateAcctToDebitFXError('');
            this.updateAcctToDebitFX(res.acct);
            this.updateSelectedAcctToDebitFX(res.acct[0]);
          } else {
            this.updateAcctToDebitFXError(res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }

  updateAcctToDebitFX(accts) {
    this.acctToDebitFXSource.next(accts);
  }

  updateSelectedAcctToDebitFX(acct) {
    this.selectedAcctToDebitFXSource.next(acct);
  }

  updateAcctToDebitFXError(message) {
    this.acctToDebitFXErrorSource.next(message);
  }


  // =================== BALANCE ENQUIRY =======================
  customerValidationUpdated(body): Observable<any> {
    const PATH = this.CUST_URL + `/CustomerValidationMoreRecord`;
    // Add customer related properties to the body object
    const cusNum = body.customerNumber;
    body = this.util.addAuthParams(body);
    delete body.customerID;
    body.customerNumber = cusNum;
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getAcctDetails(): Observable<any> {
    const PATH = this.CUST_URL + `/BalanceEnquiry`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getAcctDetailsData() {
    const body = {
      'email': '',
      'phoneNumber': '',
      'bvn': '',
      'category': 1,
      'customerNumber': this.userService.getUserDetails().userId
    };
    this.customerValidationUpdated(body).pipe(untilComponentDestroyed(this))
      .subscribe(
        res => {
          console.log(res);
          console.log(res.accountDetails);
          if (res.responseCode === '00') {
            this.updateAcctDetailsError('');
            this.updateAcctDetails(res.accountDetails);
            this.updateSelectedAcctDetails(res.accountDetails[0]);
          } else {
            this.updateAcctDetailsError(res.responseDescription);
            this.updateAcctDetails(null);
            this.updateSelectedAcctDetails(null);
            // alert('An Error Occured' + res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateAcctDetailsError(`Oops! We couldn't reach this service at this time. Try again`);
          this.updateAcctDetails(null);
          this.updateSelectedAcctDetails(null);
        }
      );

  }

  updateAcctDetails(accts) {
    this.acctDetailSource.next(accts);
  }

  updateSelectedAcctDetails(selectedAcct) {
    this.selectedAcctDetailSource.next(selectedAcct);
  }

  updateAcctDetailsError(message) {
    this.acctDetailErrorSource.next(message);
  }

  // =================== BENEFICIARIES =========================
  getBeneficiary(acctNumber, bankCode): Observable<any> {
    const PATH = this.CUST_URL + `/GetBeneficiaryNameByNuban`;
    const user = JSON.parse(localStorage.getItem('userDetails'));

    if (user) {
      let body = {
        'beneficiaryBankCode': bankCode,
        'beneficiaryAccountNumber': acctNumber,
        'customerAccountNumber': user.userId,
      };
      body = this.util.addAuthParams(body);
      console.log(body); // for debugging only
      return this.http.post<Response>(PATH, body)
        .pipe(
          retry(3),
          catchError(this.util.handleError)
        );
    } else {
      this.router.navigate(['/onboarding/login']);
    }

  }

  // Query funtion that returns accounts from the API.
  getPreregisteredBeneficiaries(): Observable<any> {
    const PATH = this.CUST_URL + `/GetPreregisteredBeneficiaries`;
    const user = JSON.parse(localStorage.getItem('userDetails'));

    if (user) {
      let body: any = {};
      body = this.util.addAuthParams(body);
      console.log(body); // for debugging only
      return this.http.post<Response>(PATH, body)
        .pipe(
          retry(3),
          catchError(this.util.handleError)
        );
    } else {
      this.router.navigate(['/onboarding/login']);
    }

  }

  public getPreRegBeneficiariesData() {
    this.subscription = this.getPreregisteredBeneficiaries().pipe(untilComponentDestroyed(this))
    .subscribe(
        (res: PreRegBeneficiariesResponse) => {
          console.log('PreReg- ' + JSON.stringify(res)); // Delete later
          if (res.responseCode === '00') {
            this.updatePreRegBeneficiariesError('');
            this.updatePreRegBeneficiaries(res.beneficiaries);
          } else {
            this.updatePreRegBeneficiariesError(this.util.handleResponseError(res));
            this.updatePreRegBeneficiaries(null);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updatePreRegBeneficiariesError(err);
        }
      );
  }

  updatePreRegBeneficiaries(newBeneficiaries) {
    this.preRegBeneficiaries.next(newBeneficiaries);
  }

  updateSelectedPreRegBeneficiaries(newBeneficiaries) {
    this.selectedPreRegBeneficiaries.next(newBeneficiaries);
  }

  updatePreRegBeneficiariesError(message) {
    this.preRegBeneficiariesError.next(message);
  }


  // Query funtion that returns beneficiaries from the API.
  getBeneficiaries(type): Observable<any> {
    const PATH = this.CUST_URL + `/GetBeneficiaryList`;
    const user = this.userService.getUserDetails();
    console.log(user);

    if (user) {
      let body = {
        'transactionType': type,
      };
      body = this.util.addAuthParams(body);
      console.log(body); // for debugging only
      return this.http.post<Response>(PATH, body)
        .pipe(
          retry(3),
          catchError(this.util.handleError)
        );
    } else {
      this.router.navigate(['/onboarding/login']);
      alert('Your session has expired');
    }

  }

  public getBeneficiariesData(type) {
    this.getBeneficiaries(type).pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: any) => {
          console.log(res); // Delete later
          if (res.responseCode === '00') {
            this.updateBeneficiariesError('');
            this.updateBeneficiaries(res.beneficiaries);
          } else {
            this.updateBeneficiariesError(res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateBeneficiariesError(err);
        }
      );
  }

  updateBeneficiaries(newBeneficiaries) {
    this.beneficiaries.next(newBeneficiaries);
  }

  updateSelectedBeneficiaries(newBeneficiaries) {
    this.selectedBeneficiary.next(newBeneficiaries);
  }

  updateBeneficiariesError(message) {
    this.beneficiariesError.next(message);
  }

  // Query funtion that returns beneficiaries from the API.
  getBanks(): Observable<any> {
    const PATH = this.REQ_URL + `/GetBank`;
    const user = JSON.parse(localStorage.getItem('userDetails'));

    if (user) {
      const body = {
        'requestId': this.util.generateRequestId(),
        'sessionId': localStorage.getItem('userToken'),
        'channel': environment.CHANNEL,
        'userId': user.userId,
        // 'customerId': user.userId
      };
      console.log(body); // for debugging only
      return this.http.post<Response>(PATH, body)
        .pipe(
          retry(3),
          catchError(this.util.handleError)
        );
    } else {
      this.router.navigate(['/onboarding/login']);
    }

  }

  public getBanksData() {
    this.getBanks().pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: any) => {
          console.log(res); // Delete later
          if (res.responseCode === '00') {
            this.updateBanksError('');
            this.updateBanks(res.serv);
          } else {
            this.updateBanksError(res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }

  updateBanks(banks) {
    this.banks.next(banks);
  }

  updateSelectedBank(bank) {
    this.selectedBank.next(bank);
  }

  updateBanksError(message) {
    this.banksError.next(message);
  }

  customerValidation(body) {
    const PATH = this.CUST_URL + `/CustomerValidation`;
    // Add customer related properties to the body object
    body = this.util.addAuthParams(body);
    body.customerNumber = '';
    delete body.customerID;
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  // ====================== Edited by Shola ======================
  GetFXdropdowns() {
    const PATH = this.REQ_URL + `/GetFXdropdowns`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  GetCountries2() {
    const PATH = this.REQ_URL + `/GetCountries2`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  GetPurpose() {
    const PATH = this.REQ_URL + `/GetFXPaymentPurpose`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  // Query funtion that returns beneficiaries from the API.
  getFxBeneficiaries(): Observable<any> {
    const PATH = this.REQ_URL + `/GetFXUserBeneficiaries`;
    const user = this.userService.getUserDetails();
    console.log(user);

    if (user) {
      let body = {};
      body = this.util.addAuthParams(body);
      console.log(body); // for debugging only
      return this.http.post<Response>(PATH, body)
        .pipe(
          retry(3),
          catchError(this.util.handleError)
        );
    } else {
      this.router.navigate(['/onboarding/login']);
      alert('Your session has expired');
    }

  }

  public getFxBeneficiariesData() {
    this.getFxBeneficiaries().pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: any) => {
          console.log(res); // Delete later
          if (res.responseCode === '00') {
            this.updateFxBeneficiariesError('');
            this.updateFxBeneficiaries(res.fxben);
          } else {
            this.updateFxBeneficiariesError(res.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateFxBeneficiariesError(err);
        }
      );
  }

  updateFxBeneficiaries(newBeneficiaries) {
    this.fxbeneficiaries.next(newBeneficiaries);
  }

  updateSelectedFxBeneficiaries(newBeneficiaries) {
    this.fxselectedBeneficiary.next(newBeneficiaries);
  }

  updateFxBeneficiariesError(message) {
    this.fxbeneficiariesError.next(message);
  }

  GetBeneficiaryDetails(SerialNumber) {
    const PATH = this.REQ_URL + `/GetFXUserBeneficiaryDetails`;
    let body = {
      'SerialNo': SerialNumber
    };
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

}
