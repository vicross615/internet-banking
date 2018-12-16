import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import {
  NgbTypeaheadSelectItemEvent,
  NgbTypeahead
} from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import {
  Beneficiary,
  Beneficiaries,
  Banks,
  AcctToDebit
} from '../../_customer-model/customer.model';
import { TransferService } from '../../transfers/_services/transfer.service';
import { UtilitiesService } from '../../../_services/utilities.service';

@Component({
  selector: 'app-school-fees-advance',
  templateUrl: './school-fees-advance.component.html',
  styleUrls: ['./school-fees-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SchoolFeesAdvanceComponent implements OnInit {
  public schoolFeesAdvanceForm: FormGroup;
  public acctToDebit: Array<any> = [];
  acctToCreditModel: string;
  public accountToDebit: AcctToDebit = null;
  public tenors: Array<any> = [];
  selectedTenor: any;
  public insuranceProviders: any;
  selectedinsuranceProvider: any;
  successMessage = '';
  errorMessage = '';
  loanRequestString = '';
  public newBeneficiaryDetail: any;
  public selectedSavedBeneficiaryDetail: Beneficiaries;
  isLoading: boolean;
  loadingBeneficiary: boolean;
  public banks: Array<Banks> = [];
  banksModel: string;
  public selectedBank: Banks;
  public formSubmit: boolean;
  public reqBody: Object;
  @Input()
  body;

  @ViewChild('savedBeneficiariesInstance')
  savedBeneficiariesInstance: NgbTypeahead;
  @ViewChild('banksInstance')
  banksInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  beneficiaryName: any;
  eligibleAmt: any;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    private util: UtilitiesService
  ) {
    this.tenors = [
      { code: 30, name: '30 days' },
      { code: 60, name: '60 days' },
      { code: 90, name: '90 days' },
      { code: 120, name: '120 days' }
    ];

    this.insuranceProviders = [
      { code: 1, name: 'AXA Mansard Insurance' },
      { code: 2, name: 'Cornerstone Insurance' },
      { code: 3, name: 'Leadway Insurance' }
    ];

    this.selectedTenor = this.tenors[0];
    this.selectedinsuranceProvider = this.insuranceProviders[0];

    this.createSchoolFeesAdvanceForm();
  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.schoolFeesAdvanceForm.controls['acctToCredit'].patchValue($event);
    this.getSalaryAdvanceEligibleAmount(this.accountToDebit.nuban, '1');
  }

  getSalaryAdvanceEligibleAmount(nuban, reqtype) {
    console.log('schl fees advance started');
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
      this.createSchoolFeesAdvanceForm();
    }
  }

  ngOnInit() {

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
    // if (this.schoolFeesAdvanceForm.value.beneficiaryOption === 'SAVED') {
    //   beneficiaryName = this.schoolFeesAdvanceForm.value.savedBeneficiary.name;
    //   beneficiaryAcctNo = this.schoolFeesAdvanceForm.value.savedBeneficiary.accountNumber;
    //   beneficiaryBankCode = this.schoolFeesAdvanceForm.value.savedBeneficiary.bankCode;
    // } else {
    //   beneficiaryName = this.newBeneficiaryDetail.accountName;
    //   beneficiaryAcctNo = this.newBeneficiaryDetail.nuban;
    //   beneficiaryBankCode = this.schoolFeesAdvanceForm.value.bank.code;
    // }

    const loanRequestString = {
      AccountToCredit: this.schoolFeesAdvanceForm.value.acctToCredit.fullAcctKey,
      ApplicantName: this.schoolFeesAdvanceForm.value.acctToCredit.accountName,
      EligibilityAmount: this.eligibleAmt.toString(),
      LoanAmount: JSON.stringify(this.schoolFeesAdvanceForm.value.loanAmt),
      NetMonthlySalaryAmount: this.schoolFeesAdvanceForm.value.monthlySalary.toString(),
      // TenorInDays: this.schoolFeesAdvanceForm.value.tenor,
      TenorInDays: this.selectedTenor.code,
      ChildName: this.schoolFeesAdvanceForm.value.childName,
      ChildSchool: this.schoolFeesAdvanceForm.value.childSchool,
      InsuranceProvider: this.schoolFeesAdvanceForm.value.insuranceProviders,
      LoanType: 'SchoolFeesAdvance'
    };

    console.log(JSON.stringify(loanRequestString).replace('a', 'ws'));
    const LoanRequestString = JSON.stringify(loanRequestString);
    this.reqBody = {
      LoanRequestString,
      SecretAnswer: this.schoolFeesAdvanceForm.value.secretAnsw,
    };
    this.formSubmit = true;
    console.log(this.reqBody);
  }

  createSchoolFeesAdvanceForm() {
    this.schoolFeesAdvanceForm = this.fb.group({
      acctToCredit: ['', Validators.required],
      loanAmt: ['', Validators.required],
      tenor: ['', Validators.required],
      monthlySalary: ['', Validators.required],
      childName: ['', Validators.required],
      childSchool: ['', Validators.required],
      insuranceProviders: ['', Validators.required],
      checkAgree: [false, Validators.required],
      secretAnsw: ['', Validators.required]
    });
  }

  clearBeneficiary() {
    this.schoolFeesAdvanceForm.controls['savedBeneficiary'].patchValue('');
    this.schoolFeesAdvanceForm.controls['newBeneficiary'].patchValue('');
    this.schoolFeesAdvanceForm.controls['bank'].patchValue('');
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
