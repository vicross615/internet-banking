import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../_models/user';
import { FreqBeneficiaries } from '../_customer-model/customer.model';
import { UtilitiesService } from '../../_services/utilities.service';
import { UserService, CustomerInformation } from '../../_services/user.service';
@Injectable({ providedIn: 'root' })
export class InvestmentServices {
  user: User;

  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;

  private freqBeneficiaries = new BehaviorSubject<FreqBeneficiaries[]>(null);
  freqBeneficiariesCast = this.freqBeneficiaries.asObservable();
  public selectedfreqBeneficiary = new BehaviorSubject<FreqBeneficiaries>(null);
  selectedfreqBeneficiaryCast = this.selectedfreqBeneficiary.asObservable();
  userDetails: CustomerInformation;

  constructor(
    private http: HttpClient,
    public util: UtilitiesService,
    private router: Router,
    private userService: UserService
  ) {
    this.userService.customerDetailsObserver
    .subscribe(
      (response: CustomerInformation) => {
        this.userDetails = response;
        console.log(this.userDetails);
      }
    );
    this.user = this.userService.getUserDetails();
  }

  loanBookingRequest(body) {
    const PATH = this.CUST_URL + `/LoanRequest`;
    // Add customer related properties to the body object
    body = this.util.addAuthParams(body);
    delete body.customerId;
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }
  // Returns employer details required for max advance transaction.
  maximumAdvanceEmployerDetailsService(employer) {
    const PATH = this.CUST_URL + `/MaxEmployerDetails`;
    if (this.user) {
      let body = {
        oranganisationID: employer.orgId,
        customerNumber: this.user.userId
      };
      body = this.util.addAuthParams(body);
      return this.http.post<any>(PATH, body).pipe(
        retry(3),
        catchError(this.util.handleError)
      );
    } else {
      this.router.navigate(['/onboarding/login']);
    }
  }

  maxAdvanceLoanRequest(form, employer, eligibilityAmount) {
    const PATH = this.CUST_URL + `/LoanRequest`;
    // Add customer related properties to the body object
    const loanObject = {
      AccountToCredit: form.value.acctNumber.fullAcctKey,
      EligibilityAmount: eligibilityAmount,
      LoanAmount: form.value.loan_amount.replace(/,/g, ''),
      TenorInMonths: employer.tenor, // employer api also returns this value, so form or api.
      EmployerName: form.value.employer.orgName,
      EmployerAddress: form.value.employer_add, // An API Should Returns this
      JobPosition: form.value.JobPosition,
      AccountName: form.value.acctNumber.accountName,
      DateOfBirth: this.userDetails.birthday,
      MobileNunberOne: this.userDetails.phone,
      MobileNumberTwo: this.userDetails.phone,
      EmailAddress: this.user.email,
      ResidentialAddress: this.userDetails.residentialAddress,
      NextOfKinName: form.value.next_of_kin,
      NextOfKinNumber: form.value.next_of_kin_phone,
      OrganisationName: form.value.employer.orgId,
      StaffType: form.value.staff_type.value,
      ConfirmationStatus: form.value.confirmation_type.value,
      MonthlySalary: form.value.salary.replace(/,/g, ''),
      LenghtOfServiceMonths: form.value.service_length,
      InsuranceProvider: form.value.insurance_provider.code,
      InterestRate: employer.interestRate,
      InsuranceRate: employer.creditInsurance,
      ManagementFee: employer.mgtFee,
      CommitmentFee: employer.commissionFee,
      RenewalFee: employer.renewalFee,
      UndertakingType: employer.undertakingType,
      RepaymentFrequency: employer.repaymentFrequency,
      BVN: this.user.userBVN,
      LoanType: 'MaxAdvance',
      EmpUndertakingBase64StringFile: form.value.employer_undertakingFile,
      EmpUndertakingFileType: form.value.EmpUndertakingFileType,
      EmpUndertakingFileName: form.value.EmpUndertakingFileName,
      StaffIdcardBase64StringFile: form.value.staff_id,
      StaffIdCardFileType: form.value.StaffIdCardFileType,
      StaffIdCardFileName: form.value.StaffIdCardFileName,
    };
    const LoanRequestString = JSON.stringify(loanObject);
    let body: any = { };
    body = {
      LoanRequestString,
      SecretAnswer: form.value.secret_ans,
      AuthMode: 'TOKEN',
      AuthValue: form.value.token,
    };
    body = this.util.addAuthParams(body);
    delete body.customerId;
    body.toString();
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  loanEligibiltiyAmount(form) {
    const PATH = this.CUST_URL + `/LoanEligibilityStatus`;
    // Add customer related properties to the body object
    const body = {
      accountNumber: form.nuban,
      requestType: 1,
      requestId: this.util.generateRequestId(),
      customerNumber: this.user.userId,
      channel: environment.CHANNEL,
      userId: this.user.userId,
      sessionId: localStorage.getItem('userToken')
    };
    return this.http.post<EligibleAmount>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }
}
export interface EligibleAmount {
  eligibleAmount: number;
  responseDescription: string;
}
