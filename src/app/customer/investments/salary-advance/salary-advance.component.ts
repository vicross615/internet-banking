import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable ,  Subject } from 'rxjs';
import { Beneficiary, Beneficiaries, Banks, AcctToDebit } from '../../_customer-model/customer.model';
import { distinctUntilChanged, debounceTime, merge, filter, map } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TransferService } from '../../transfers/_services/transfer.service';
import { UtilitiesService } from '../../../_services/utilities.service';

@Component({
  selector: 'app-salary-advance',
  templateUrl: './salary-advance.component.html',
  styleUrls: ['./salary-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('500ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ],
})

export class SalaryAdvanceComponent implements OnInit {
  public salaryAdvanceForm: FormGroup;
  public acctToDebit: Array<any> = [];
  acctToCreditModel: string;
  public accountToDebit: AcctToDebit = null;
  tenor: any;
  public empSectors: Array<any> = [];
  selectedEmpSectors: any;
  public employeeStatus: Array<any> = [];
  selectedEmployeeStatus: any;
  public salFrequency: Array<any> = [];
  selectedSalFrequency: any;
  public tenors: Array<any> = [];
  selectedTenor: any;
  public insuranceProviders: any;
  selectedinsuranceProvider: any;
  successMessage = '';
  errorMessage = '';
  public newBeneficiaryDetail: any;
  public selectedSavedBeneficiaryDetail: Beneficiaries;
  isLoading: boolean;
  loadingBeneficiary: boolean;
  public banks: Array<Banks> = [];
  banksModel: string;
  public selectedBank: Banks;
  public formSubmit: boolean;
  public reqBody: Object;
  @Input() body;

  @ViewChild('savedBeneficiariesInstance') savedBeneficiariesInstance: NgbTypeahead;
  @ViewChild('banksInstance') banksInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  beneficiaryName: any;
  eligibleAmt: any = 0.00;


  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    private util: UtilitiesService,
  ) {
    this.tenor = 30;
    this.empSectors = [
      { code: 'Federal', name: 'Federal'},
      { code: 'State', name: 'State'},
      { code: 'Local', name: 'Local'},
      { code: 'Private', name: 'Private'},
    ];

    this.employeeStatus = [
      { code: '1', name: 'Contract'},
      { code: '2', name: 'Confirmed Full Staff'},
      { code: '3', name: 'Unconfirmed Full Staff'},
    ];

    this.salFrequency = [
      { code: '1', name: 'Once'},
      { code: '2', name: 'Twice'},
      { code: '3', name: 'Thrice'},
    ];

    this.selectedEmpSectors = this.empSectors[0];
    this.selectedEmployeeStatus = this.employeeStatus[0];
    this.selectedSalFrequency = this.salFrequency[0];
    // this.customerService.getBeneficiariesData('NIP');
    // console.log('bene: ' + this.savedBeneficiaries);
    // this.customerService.banks$.subscribe(
    //   banks => this.banks = banks
    // );
    // console.log('Banks: ' + this.banks);      // delete later;
    this.createSalaryAdvanceForm();
  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.salaryAdvanceForm.controls['acctToCredit'].patchValue($event);
    this.getSalaryAdvanceEligibleAmount(this.accountToDebit.nuban, '1');
    }

    getSalaryAdvanceEligibleAmount(nuban, reqtype) {
      console.log('salary advance started');
      this.transferService.LoanEligibilityStatus(nuban, reqtype)
      .subscribe(
          (res: any) => {
            console.log(res); // Delete
            if (res.responseCode === '00') {
              this.eligibleAmt = res.eligibleAmount;
              console.log(this.eligibleAmt);
            } else {
              this.eligibleAmt = this.util.handleResponseError(res);
            }
          },
          err => {
            console.error('Session is expired, please Login');
            console.log(err);
          }
        );
    }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createSalaryAdvanceForm();
    }
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.customerService.beneficiaries$.subscribe(
    //     beneficiaries => this.savedBeneficiaries = beneficiaries
    //   );
    // }, 2000);

  }

  // Method that ruturns Sal Adv Eligible Amt
  // public onkey(nuban: string, bank: Banks) {
  //   if (nuban.length === 10 && this.salaryAdvanceForm.value.bank) {
  //     this.errorMessage = '';
  //     console.log('bankcode: ' + bank.code);
  //     this.customerService.getBeneficiary(nuban, bank.code)
  //     .subscribe(
  //       (res: Beneficiary) => {
  //           console.log(res);
  //           if (res.responseCode === '00') {
  //             // this.salaryAdvanceForm.controls['newBeneficiary'].patchValue(res.accountName);
  //             this.newBeneficiaryDetail = res;
  //             console.log('Beneficiary Details' + JSON.stringify(this.newBeneficiaryDetail));
  //             this.errorMessage = '';
  //           } else {
  //             this.errorMessage = `Unable to verify ${nuban}. Check that account number and bank selected are correct`;
  //             this.successMessage = '';
  //           }
  //       },
  //       (err: HttpErrorResponse) => {
  //         console.log(err.error);
  //       }
  //     );
  //   } else if (nuban.length > 10) {
  //     this.successMessage = '';
  //     this.errorMessage = 'nuban entered is greater than 10 digit';
  //   } else {
  //     this.successMessage = '';
  //     this.errorMessage = 'Enter 10 digit NUBAN';
  //   }

  // }

  // Method that opens the Token confirmation modal
  openTokenConfirmationModal() {
    // let beneficiaryName = '';
    // let beneficiaryAcctNo = '';
    // let beneficiaryBankCode = '';
    // if (this.salaryAdvanceForm.value.beneficiaryOption === 'SAVED') {
    //   beneficiaryName = this.salaryAdvanceForm.value.savedBeneficiary.name;
    //   beneficiaryAcctNo = this.salaryAdvanceForm.value.savedBeneficiary.accountNumber;
    //   beneficiaryBankCode = this.salaryAdvanceForm.value.savedBeneficiary.bankCode;
    // } else {
    //   beneficiaryName = this.newBeneficiaryDetail.accountName;
    //   beneficiaryAcctNo = this.newBeneficiaryDetail.nuban;
    //   beneficiaryBankCode = this.salaryAdvanceForm.value.bank.code;
    // }
    const loanRequestString = {
      AccountToCredit: this.salaryAdvanceForm.value.acctToCredit.nuban,
      EligibilityAmount: this.eligibleAmt,
      LoanAmount: this.salaryAdvanceForm.value.loanAmt,
      TenorDays: this.tenor,
      EmployerName: this.salaryAdvanceForm.value.employerName,
      EmployerAddress: this.salaryAdvanceForm.value.employersAddress,
      JobDesignation: this.salaryAdvanceForm.value.jobDesig,
      NetMonthlySalary: this.salaryAdvanceForm.value.monthlySalary,
      NextSalaryPayDay: this.util.formatDate(this.salaryAdvanceForm.value.nxtSalaryPayDate),
      GrossAnnualSalary: this.salaryAdvanceForm.value.annualGrossSalary,
      EmploymentSector: this.salaryAdvanceForm.value.empSectors,
      NetAnnualSalary: this.salaryAdvanceForm.value.netAnnualSalary,
      YearlyUpFrontPay: this.salaryAdvanceForm.value.yearlyUpfrontPayment,
      QuaterlyAlowance: this.salaryAdvanceForm.value.quarterlyAllowance,
      LastNetMonthSalary: this.salaryAdvanceForm.value.lastMonthSalary,
      EmploymentStatus: this.salaryAdvanceForm.value.employeeStatus,
      LenghgtOfServiceYears: this.salaryAdvanceForm.value.yearServiceLength,
      LenghtOfServiceMonths: this.salaryAdvanceForm.value.monthServiceLength,
      CurrencyPaidIn: 'Naira',
      SalaryFrequency: this.salaryAdvanceForm.value.salFrequency,
      AnyExistingLoan: this.salaryAdvanceForm.value.existOblig,
      MonthlyRepayMentAmount: Number(this.salaryAdvanceForm.value.loanRepayment),
      BVN: this.salaryAdvanceForm.value.bvn,
      LoanType: 'SalaryAdvance',
    };

    console.log(JSON.stringify(loanRequestString));

    this.reqBody = {
     'LoanRequestString': JSON.stringify(loanRequestString),
     'SecretAnswer': this.salaryAdvanceForm.value.secretAnsw,
    };
    this.formSubmit = true;
    console.log(this.reqBody);
  }

  createSalaryAdvanceForm() {
    this.salaryAdvanceForm = this.fb.group({
      'acctToCredit': ['', Validators.required],
      'loanAmt': ['', Validators.required],
      'tenor': '30',
      'employerName': ['', Validators.required],
      'employersAddress': ['', Validators.required],
      'jobDesig': ['', Validators.required],
      'monthlySalary': ['', Validators.required],
      'nxtSalaryPayDate': ['', Validators.required],
      'annualGrossSalary': ['', Validators.required],
      'empSectors': ['', Validators.required],
      'netAnnualSalary': ['', Validators.required],
      'yearlyUpfrontPayment': ['', Validators.required],
      'quarterlyAllowance': ['', Validators.required],
      'lastMonthSalary': ['', Validators.required],
      'employeeStatus': ['', Validators.required],
      'yearServiceLength': ['', Validators.required],
      'monthServiceLength': ['', Validators.required],
      'salFrequency': ['', Validators.required],
      'existOblig': 'false',
      'loanRepayment': '',
      'bvn': ['', Validators.required],
      'secretAnsw': ['', Validators.required]
    });
  }

  clearBeneficiary() {
    this.salaryAdvanceForm.controls['savedBeneficiary'].patchValue('');
    this.salaryAdvanceForm.controls['newBeneficiary'].patchValue('');
    this.salaryAdvanceForm.controls['bank'].patchValue('');
    this.newBeneficiaryDetail = '';
    console.log(this.newBeneficiaryDetail);
    /* {
      accountName: '',
      nuban: '',
      oldAccountNo: '',
      requestId: '',
      responseCode: '',
      responseDescription: ''
    }; */
    this.successMessage = '';
  }

  savedBeneficiary() {}

}
