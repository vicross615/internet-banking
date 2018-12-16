import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CurrencyResponseObject } from '../open-dom-account/open-dom-account.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import {
  UserService,
  CustomerInformation
} from '../../../_services/user.service';
import { User } from '../../../_models/user';
// END

@Injectable({ providedIn: 'root' })
export class AccountsService implements OnDestroy {
  private cust_URL = environment.BASE_URL + environment.CUST_SERV;
  private Req_URL = environment.BASE_URL + environment.REQ_SERV;
  public employerListSource = new Subject<any>();
  employerListObservable = this.employerListSource.asObservable();
  userDetails: CustomerInformation;
  user: User;
  sessionId = localStorage.getItem('userToken');
  currentUserEmail: string[];

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router,
    private userService: UserService
  ) {
    // Subscribe to user Details from UserService
    setTimeout(() => {
      this.userService.customerDetailsObserver
        .pipe(untilComponentDestroyed(this))
        .subscribe((response: CustomerInformation) => {
          this.userDetails = response;
          console.log(this.userDetails);
        });
    }, 5000);
  }

  ngOnDestroy(): void {}

  // =========================== FOR YOU: MaxAdvanceOraganisations ==============================
  get maxAdvanceEmployerList() {
    const PATH = this.cust_URL + `/MaxAdvanceOraganisations`;
    let body = {};
    body = this.util.addAuthParams(body);
    return this.http.post<CurrencyResponseObject>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  initializeDataMaxAdvanceEmployerList() {
    this.maxAdvanceEmployerList
      .pipe(untilComponentDestroyed(this))
      .subscribe(res => this.employerListSource.next(res));
  }

  // =========================== FOR YOU: ADD ADDITIONAL ACCOUNT ==================================

  addAccount(form): Observable<any> {
    this.user = this.userService.getUserDetails();
    const PATH = this.cust_URL + `/AdditionalAccountOpening`;
    const body = {
      ledger: form.acct.Id,
      requestId: this.util.generateRequestId(),
      customerNumber: this.user.userId,
      channel: environment.CHANNEL,
      userId: this.user.userId,
      sessionId: this.sessionId,
      SecretAnswer: form.secretAnsw
    };
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // =========================== FOR YOU: OPEN DOM ACCOUNT ==============================
  openDomAccount(form) {
    const PATH = this.cust_URL + `/DomAccountOpening`;
    let body = {
      currency: form.currency.code,
      SecretAnswer: form.secretAnswer
    };
    body = this.util.addAuthParams(body);
    return this.http.post<CurrencyResponseObject>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // =========================== FOR YOU: GetCurrencyName_Code ==============================
  currencyNameCode() {
    const PATH = this.Req_URL + `/GetCurrencyName_Code`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<CurrencyResponseObject>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // =========================== ACCOUNT UPGRADE ==============================

  accountUpgrade(form) {
    console.log(form);
    const PATH = this.cust_URL + '/AccountUpgrade';
    this.user = this.userService.getUserDetails();
    let body: any = {
      bvn: this.user.userBVN,
      accountName: this.user.userFullName,
      nuban: form.acctToDebit.nuban,
      meansOfID: form.meansOfIdentification.code,
      regulatoryID: form.regulatoryIdNumber,
      phoneNumber: form.phone,
      address: form.address,
      emailAddress: form.email,
      gender: form.gender.code,
      dateOfBirth: this.util.formatDatewithSlash(form.birthday),
      maritalStatus: form.maritalStatus.code,
      nationality: form.nationality.code,
      stateOfOrigin: form.stateOfOrigin.code,
      stateOfResidence: form.stateOfResidence.code,
      lga: form.localGovt.code,
      upgradeTier: form.tierType.code,
      employmentStatus: form.employmentStats.code,
      occupation: form.occupation,
      employerName: form.employersName,
      employerAddress: form.employersAddress,
      dateOfEmployment: this.util.formatDatewithSlash(form.dateEmployed),
      SecretAnswer: form.secretAnswer,
       // Reg ID
      regulatoryIDDOCFileName: form.regulatoryIDDOCFileName,
      regulatoryIDDOCSBAse64StringFile: form.regulatoryIDFile,
      regulatoryIDDOCFileType: form.regulatoryIDFileType,
      // Utility
      utilityBillFileName: form.utilityBillFileName,
      utilityBillBase64StringFile: form.utilityBillFile,
      utilityBillFileType: form.utilityBillFileType,
      // Birth Cert
      DOBBase64StringFile: form.birthCertFile ,
      DOBFileName: form.birthCertFileName ,
      DOBFileType: form.birthCertFileType ,
      // Marriage Cert
      MariCertBase64StringFile: form.marrigeCertFile ,
      MariCertFileName: form.marrigeCertFileName ,
      MariCertFileType: form.marrigeCertFileType ,
      // NewPaper Pub
      NPaperPubBase64StringFile: form.newsPaperFile,
      NPaperPubFileName: form.newsPaperFileName ,
      NPaperPubFileType: form.newsPaperFileType,
    };
    body = this.util.addAuthParams(body);
    delete body.customerId;
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // =========================== ACCOUNT UPDATE ==============================
  accountUpdate(form) {
    console.log(form);
    const PATH = this.cust_URL + '/AccountUpdateEmailMobNum';
    let body: any = {};
    body = {
      email: form.email,
      mobnum: form.mobnum,
      authMode: 'TOKEN',
      authValue: form.token,
      secretAnswer: form.secretAnswer
    };
    body = this.util.addAuthParams(body);
    delete body.customerId;
    console.log(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  // ===========================================

  /*---------- Send Secure Mail -----------*/
  sendSecureEmailService(form) {
    this.user = this.userService.getUserDetails();
    console.log(form);
    const PATH = this.cust_URL + '/SendSecureMail';
    const body = {
      transactionType: form.transactionType.id,
      mailSubject: form.mailSubject,
      mailBody: form.mailBody,
      customerName: this.user.userFullName,
      customerEmailAddress: form.customerEmailAddress,
      /* tokenText: form.token, */
      customerUserId: this.user.userId,
      accountToDeBit: form.accountToDeBit.fullAcctKey,
      uploadedBase64StringFile: form.File,
      fileType: form.FileType,
      fileName: form.FileName,
      requestId: this.util.generateRequestId(),
      secretAnswer: form.secretAnswer,
      channel: environment.CHANNEL,
      userId: this.user.userId,
      customerNumber: this.user.userId,
      sessionId: this.sessionId
    };
    console.log(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  get AccountToDebitAll() {
    const PATH = this.cust_URL + '/GetAccountToDebitAll';
    let body = {};
    body = this.util.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }
}
