import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AccountsService } from '../../accounts/_services/accounts.service';
import { transition, trigger, animate, style } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { InvestmentServices, EligibleAmount } from '../investment.service';
import { FileConverterService } from '../../../_services/file-converter.service';
import { UserService } from '../../../_services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { UtilitiesService } from '../../../_services/utilities.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-maximum-advance',
  templateUrl: './maximum-advance.component.html',
  styleUrls: ['./maximum-advance.component.scss'],
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
export class MaximumAdvanceComponent implements OnInit, AfterViewInit, OnDestroy {
  max_AdvanceForm: FormGroup;
  activeService = 'Maximum Advance';
  accountNumber: any;
  employerObject: Array<EmployerModel> = [];
  organizationDetails: any = null; // used to store the organization details from the API call.
  showOrganizationDetails = false;
  cardCharges: string;
  declarationStatus = null;
  isPermanent = false; // Ideally for form
  loan_limit: number;
  // Token modal objects
  public formSubmit = false;
  isSuccess: boolean;
  isLoading: boolean;
  form: any; // holds ngForm values
  message: any = null;
  submitStatus: boolean;
  currentUser: any;
  public notifications: IbankNotifications = {};

  @ViewChild('input')
  private checkInput;

  // hard coded Staff Type
  staffTypeObject: Array<any> = [
    { info: 'Permanent / Full Time', value: 'PERMANENT' },
    { info: 'Contract', value: 'CONTRACT' }
  ];
  // hard coded confirmation status
  confirmationTypeObject: Array<any> = [
    { info: 'Confirmed', value: 'CONFIRMED' },
    { info: 'UnConfirmed', value: 'UNCONFIRMED' }
  ];
  // hard coded insurance provider
  insuranceProviders = [
    { code: '1', name: 'AXA Mansard Insurance' },
    { code: '2', name: 'Cornerstone Insurance' },
    { code: '3', name: 'Leadway Insurance' }
  ];
  eligibleAmountFeedback: EligibleAmount;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private accountsService: AccountsService,
    private investmentService: InvestmentServices,
    private fileUploadService: FileConverterService,
    public util: UtilitiesService
  ) {
    this.currentUser = this.userService.getUserDetails();
  }

  ngOnInit() {
    this.createMaxAdvanceForm();
    this.initializeForm();
    this.userService.userDetailsData();
  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit() {}

  setNotification(type, title, msg) {
    this.notifications.message = msg;
    this.notifications.title = title;
    this.notifications.type = type;
  }

  visibilityHandler($event) {
    if ($event === true) {
      this.notifications = {};
      this.organizationDetails = null;
      this.max_AdvanceForm.reset();
    }
  }

  checkDeclaration() {
    this.checkInput.nativeElement.checked
      ? (this.declarationStatus = true)
      : (this.declarationStatus = false);
  }
  // Wake up the Form
  async initializeForm() {
    await this.accountsService.initializeDataMaxAdvanceEmployerList();
    this.accountsService.employerListObservable.subscribe(res => {
      this.employerObject = res.maxAdvanceCompanyDetails;
    });
  }

  // Upload Documents
  set uploadEmployerUndertakingFile($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    this.max_AdvanceForm.controls['EmpUndertakingFileName'].patchValue(
      selectedfileProperties.name
    );
    this.max_AdvanceForm.controls['EmpUndertakingFileType'].patchValue(
      selectedfileProperties.type
    );
    setTimeout(() => {
      this.fileUploadService.fileObservable.subscribe(response => {
        this.max_AdvanceForm.controls['employer_undertakingFile'].patchValue(
          response
        );
      });
    }, 1000);
    return;
  }

  // Upload Service
  set uploadStaffIDFile($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    this.max_AdvanceForm.controls['StaffIdCardFileName'].patchValue(
      selectedfileProperties.name
    );
    this.max_AdvanceForm.controls['StaffIdCardFileType'].patchValue(
      selectedfileProperties.type
    );
    setTimeout(() => {
      this.fileUploadService.fileObservable.subscribe(response => {
        this.max_AdvanceForm.controls['staff_id'].patchValue(response);
      });
    }, 1000);
    return;
  }

  // This function returns details of the selected organization.
  async employerDetails() {
    const organization = this.max_AdvanceForm.controls.employer.value;
    this.organizationDetails = await this.investmentService
      .maximumAdvanceEmployerDetailsService(organization)
      .toPromise()
      .then(response => {
        return response;
      });
    if (this.organizationDetails) {
      // Get the eligible Amount
      this.eligibleAmountFeedback = await this.investmentService
        .loanEligibiltiyAmount(this.accountNumber)
        .toPromise()
        .then((response: EligibleAmount) => {
          return response;
        });
      this.loan_limit = this.eligibleAmountFeedback.eligibleAmount;
    }
    if (this.loan_limit < 100000) {
      this.setNotification(
        'info',
        'Sorry',
        `You Are Currently Not Eligible For A Max Advance Loan`
      );
    } else {
      this.displayDetails = true; // This is a TypeScript Accessors that accepts a boolean parameter
    }
  }

  // this is used to toggle the display for organization details.
  set displayDetails(state) {
    this.showOrganizationDetails = state;
  }
  // Reactive Form.
  createMaxAdvanceForm() {
    this.max_AdvanceForm = this.fb.group({
      acctNumber: ['', Validators.required],
      loan_amount: ['', Validators.required],
      tenor: ['', Validators.required],
      employer: ['', Validators.required],
      next_of_kin: ['', Validators.required],
      next_of_kin_phone: ['', Validators.required],
      employer_add: ['', Validators.required],
      service_length: ['', Validators.required],
      secret_ans: ['', Validators.required],
      staff_type: ['', Validators.required],
      confirmation_type: ['', Validators.required],
      staff_id: ['', Validators.required],
      StaffIdCardFileType: [''],
      StaffIdCardFileName: [''],
      employer_undertakingFile: ['', Validators.required],
      EmpUndertakingFileType: [''],
      EmpUndertakingFileName: [''],
      insurance_provider: [''],
      salary: ['', Validators.required],
      JobPosition: ['', Validators.required],
      address: [''],
      token: ['']
    });
  }
  /* ======= Typeaheads ======== */
  acctToDebitEventHandler($event: any) {
    this.accountNumber = $event;
    this.max_AdvanceForm.controls['acctNumber'].patchValue($event);
  }

  onSubmit(form) {
    this.isLoading = true;
    this.investmentService
      .maxAdvanceLoanRequest(form, this.organizationDetails, this.loan_limit)
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response && response.responseCode === '00') {
            this.isLoading = false;
            this.message = response.responseDescription;
            this.isSuccess = true;
            this.max_AdvanceForm.reset();
          } else {
            // If not Success - Handle Error
            this.isLoading = false;
            this.message = response.responseDescription
              .replace('|', '<br>')
              .replace('|', '<br>');
          }
        },
        (error: HttpErrorResponse) => {
          this.message = error;
          this.isLoading = false;
          console.log(error);
        }
      );
  }

  // Method that opens the Token confirmation modal
  openTokenConfirmation(form: NgForm) {
    this.form = form;
    this.formSubmit = true;
  }
  inititateService($event) {
    this.max_AdvanceForm.controls['token'].patchValue($event);
    this.onSubmit(this.form);
  }
  clearError() {
    this.isSuccess = null;
    this.message = null;
    this.isLoading = false;
    this.formSubmit = false;
    this.declarationStatus = false;
  }
}
export interface EmployerModel {
  orgId: number;
  orgName: string;
}
