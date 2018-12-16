import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm
} from '@angular/forms';
import { UtilitiesService } from '../../../_services/utilities.service';
import { AccountsService } from '../_services/accounts.service';
import { FileConverterService } from '../../../_services/file-converter.service';
import { UserService } from '../../../_services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { Router } from '@angular/router';
import { merge } from 'rxjs/observable/merge';
import { headersToString } from 'selenium-webdriver/http';

@Component({
  selector: 'app-account-upgrade',
  templateUrl: './account-upgrade.component.html',
  styleUrls: ['./account-upgrade.component.scss'],
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
export class AccountUpgradeComponent
  implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = null;
  formState = 1;
  accountUpgradeForm: FormGroup;
  accountUpdateForm: FormGroup;
  selectedMOD: any = {};
  ID: any;
  maritalStatusObject: any;
  genderObject: any;
  DateModel: any;
  countries: any;
  statesObject: any = null;
  localGovtObject: any;
  statesOfResidenceObject: any;
  tierTypeObject: any;
  employmentStatus: any;
  employmentValue: any;
  selectedCountry: any;
  // tslint:disable-next-line:no-inferrable-types
  serviceName: string = 'Account Upgrade / Update';
  // tslint:disable-next-line:no-inferrable-types
  requestTypeIs: number; // transaction control
  requestTypeIsForm = new FormControl(''); // toggle button control
  isSuccess: any;
  form: any; // holds ngForm values
  message: any = null;
  public formSubmit = false;
  submitStatus: boolean;
  activeService: any;
  userDetails: any;
  tokenState: boolean;
  // Account Update Global Objects.
  @ViewChild('emailForm')
  private emailInput;
  @ViewChild('phoneForm')
  private phonenumberInput;
  @ViewChild('nameForm')
  private nameInput;
  @ViewChild('addressForm')
  private addressInput;
  @ViewChild('dobForm')
  private dobInput;
  email = false;
  phone = false;
  name = false;
  dateofbirth = false;
  address = false;
  currentUserEmail: any;
  public notifications: IbankNotifications = {};
  Model: any;
  userUpdatedEmailPhone = false;
  updateObject: { email: any; mobnum: any; token: any; secretAnswer: any };
  rerouteUser: boolean;
  marriageAndPublcationBoolean: boolean;
  birthCertificateBoolean: boolean;
  userUpdatedOtherInfo = false;
  isEmailReadOnly: boolean;
  isPhoneReadOnly: boolean;
  accountForDataPopulation: any;
  birthdayObject: any = {};
  empObject: any = {};

  constructor(
    private fb: FormBuilder,
    private util: UtilitiesService,
    private accountService: AccountsService,
    private userService: UserService,
    private fileUploadService: FileConverterService,
    private router: Router
  ) {
    this.createupgradeAcctForm();
    this.initializeFormValues();
    this.createUpdateForm();
  }

  ngOnInit() {
    this.isEmailReadOnly = true;
    this.isPhoneReadOnly = true;
    this.userService.userDetailsData();
    this.requestTypeIsForm.setValue('0');
    this.userService.userDetail$.subscribe(response => console.log(response));
  }

  ngOnDestroy(): void {}

  async ngAfterViewInit() {
    await this.customer();
    await this.userService.customerDetailsObserver.subscribe(response => {
      this.userDetails = response;
      this.currentUserEmail = this.userDetails.email.split(',');
    });
    setTimeout(() => {
      this.userUpdatedOtherInfo = false;
      this.userUpdatedEmailPhone = false;
    }, 5000);
  }
  dateFormater(bday: any) {
    const mm = bday.getMonth() + 1;
    const dd = bday.getDate();
    const yyyy = bday.getFullYear();
    const formatedDate = yyyy + '/' + mm + '/' + dd;
    return formatedDate;
  }
  set editEmail(value: boolean) {
    this.isEmailReadOnly = value;
  }
  set editPhone(value: boolean) {
    this.isPhoneReadOnly = value;
  }
  async customer() {
    // Function to get customer details
    const currentUser = this.userService.getUserDetails();
    await this.userService.userDetailsData();
    this.userService.customerDetailsObserver.subscribe((res: any) => {
      if (res) {
        // Populate form with some default values
        const currentUserMoreDetails = res;
        this.accountForDataPopulation =
          currentUserMoreDetails.accountDetails[0].fullaccountkey;
        this.userService.fullUserDetailsData(this.accountForDataPopulation);
        this.userService.fullCustomerDetailsObserver.subscribe(
          (response: any) => {
            if (response) {
              const fullcustomerDetails = response.details[0];
              console.log(fullcustomerDetails);
              fullcustomerDetails.gender === '1'
                ? this.accountUpgradeForm.controls['gender'].patchValue(
                    this.genderObject[0]
                  )
                : this.accountUpgradeForm.controls['gender'].patchValue(
                    this.genderObject[1]
                  );
              this.accountUpgradeForm.controls['employersName'].patchValue(
                fullcustomerDetails.employer
              );
              for (const i in this.countries) {
                if (this.countries && this.countries[i].name === fullcustomerDetails.nationalitY_1) {
                  this.accountUpgradeForm.controls['nationality'].patchValue(this.countries[i]);
                  this.states(this.countries[i].code);
                }
              }
              for (const i in this.maritalStatusObject) {
                if (fullcustomerDetails.maritaL_STATUS = this.maritalStatusObject[i].code) {
                  this.accountUpgradeForm.controls['maritalStatus'].patchValue(
                    this.maritalStatusObject[i]);
                }
              }
              // Set Birthday and Employment Date
              if (fullcustomerDetails.dob) {
                const bday = new Date(fullcustomerDetails.dob);
                const dob = this.dateFormater(bday);
                this.birthdayObject.mm = bday.getMonth() + 1;
                this.birthdayObject.dd = bday.getDate();
                this.birthdayObject.yyyy = bday.getFullYear();
              }
              if (fullcustomerDetails.datE_OF_EMPLOY) {
                const empday = new Date(fullcustomerDetails.datE_OF_EMPLOY);
                const dob = this.dateFormater(empday);
                this.empObject.mm = empday.getMonth() + 1;
                this.empObject.dd = empday.getDate();
                this.empObject.yyyy = empday.getFullYear();
              }
            }
          }
        );
        const currentPhoneNumber = currentUserMoreDetails.phone;
        this.accountUpgradeForm.controls['phone'].patchValue(
          currentPhoneNumber
        );
        this.accountUpgradeForm.controls['address'].patchValue(
          currentUserMoreDetails.residentialAddress
        );
      }
    });
    // Patch form with default values
    this.accountUpgradeForm.controls['name'].patchValue(
      currentUser.userFullName
    );
    this.accountUpgradeForm.controls['email'].patchValue(currentUser.email);
  }
  // Dynamic Controls to update user email
  accountUpdate() {
    this.userUpdatedEmailPhone = true;
  }
  // Display Birthcertificate upload field
  uploadBirthCert() {
    this.birthCertificateBoolean = true;
  }
  // Display Marriage abnd NewsPaper upload field
  marriageAndPublication() {
    this.marriageAndPublcationBoolean = true;
  }
  // Form navigation
  set formSwitch(state) {
    this.formState = state;
  }
  // File Upload Service
  set uploadFileBillsFile($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    this.accountUpgradeForm.controls['utilityBillFileName'].patchValue(
      selectedfileProperties.name
    );
    this.accountUpgradeForm.controls['utilityBillFileType'].patchValue(
      selectedfileProperties.type
    );
    setTimeout(() => {
      this.fileUploadService.fileObservable.subscribe(response => {
        this.accountUpgradeForm.controls['utilityBillFile'].patchValue(
          response
        );
      });
    }, 1000);
    return;
  }
  // More Uploads
  set uploadRegulatoryIDFile($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    this.accountUpgradeForm.controls['regulatoryIDDOCFileName'].patchValue(
      selectedfileProperties.name
    );
    this.accountUpgradeForm.controls['regulatoryIDFileType'].patchValue(
      selectedfileProperties.type
    );
    setTimeout(() => {
      this.fileUploadService.fileObservable.subscribe(response => {
        this.accountUpgradeForm.controls['regulatoryIDFile'].patchValue(
          response
        );
      });
    }, 1000);
    return;
  }
  // Birth Certification
  set uploadBirthCertificate($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    this.accountUpgradeForm.controls['birthCertFileName'].patchValue(
      selectedfileProperties.name
    );
    this.accountUpgradeForm.controls['birthCertFileType'].patchValue(
      selectedfileProperties.type
    );
    setTimeout(() => {
      this.fileUploadService.fileObservable.subscribe(response => {
        this.accountUpgradeForm.controls['birthCertFile'].patchValue(response);
      });
    }, 1000);
    return;
  }
  // Marriage Certificate
  set uploadMarriageCertificate($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    this.accountUpgradeForm.controls['marrigeCertFileName'].patchValue(
      selectedfileProperties.name
    );
    this.accountUpgradeForm.controls['marrigeCertFileType'].patchValue(
      selectedfileProperties.type
    );
    setTimeout(() => {
      this.fileUploadService.fileObservable.subscribe(response => {
        this.accountUpgradeForm.controls['marrigeCertFile'].patchValue(
          response
        );
      });
    }, 1000);
    return;
  }
  // News Paper Publication
  set uploadNewsPaperPublication($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    this.accountUpgradeForm.controls['newsPaperFileName'].patchValue(
      selectedfileProperties.name
    );
    this.accountUpgradeForm.controls['newsPaperFileType'].patchValue(
      selectedfileProperties.type
    );
    setTimeout(() => {
      this.fileUploadService.fileObservable.subscribe(response => {
        this.accountUpgradeForm.controls['newsPaperFile'].patchValue(response);
      });
    }, 1000);
    return;
  }
  // Patch form values when selected
  acctToDebitEventHander($event: any) {
    this.accountUpgradeForm.controls['acctToDebit'].patchValue($event);
  }
  // Clear form error
  clearError() {
    this.message = null;
    this.isLoading = false;
    this.formSubmit = false;
    this.tokenState = null;
  }
  // Get List of States based on Selected Country
  get countriesEventHander() {
    const selectedCountry = this.accountUpgradeForm.controls['nationality']
      .value;
    this.states(selectedCountry.code);
    return;
  }
  // Do the same for Local Government
  get statesEventHander() {
    const selectedState = this.accountUpgradeForm.controls['stateOfOrigin']
      .value;
    this.getlocalGovt(selectedState.code);
    return;
  }
  // Get state and local govt as user selects
  public async states(e) {
    // Get list of states based on selected country's code.
    await this.util.statesService(e).subscribe((res: any) => {
      this.statesObject = res.stateDetails;
    });
  }
  getlocalGovt(e) {
    // Using the state code as a parameter, return a list of lga's
    this.util.LGA(e).subscribe(res => {
      this.localGovtObject = res.lgaDetails;
    });
  }
  /* Drop Menu Patch when selected */
  optionSelected(option) {
    this.selectedMOD = option;
    this.accountUpgradeForm.controls['meansOfIdentification'].patchValue(
      this.selectedMOD
    );
  }
  /* Oninit Initialize Form */
  initializeFormValues() {
    this.util.form_utilities('/GetGender').subscribe((res: any) => {
      this.genderObject = res.dropDownList;
      console.log(this.genderObject);
    });
    this.util.form_utilities('/GetMaritalStatus').subscribe((res: any) => {
      this.maritalStatusObject = res.dropDownList;
    });
    this.util
      .form_utilities('/GetMeansOfIdentification')
      .subscribe((res: any) => {
        this.ID = res.dropDownList;
        this.optionSelected(this.ID[0]);
      });
    this.util.form_utilities('/Tier').subscribe((res: any) => {
      this.tierTypeObject = res.dropDownList;
      this.accountUpgradeForm.controls['tierType'].patchValue(
        this.tierTypeObject[1]
      );
    });
    this.util.form_utilities('/GetCountries').subscribe((res: any) => {
      this.countries = res.countryInfoDetails;
    });
    this.util.employment_Status().subscribe((res: any) => {
      this.employmentStatus = res.dropDownList;
    });
  }

  /* Create Reative Form */
  createupgradeAcctForm() {
    this.accountUpgradeForm = this.fb.group({
      meansOfIdentification: [''],
      regulatoryIdNumber: [''],
      gender: [''],
      acctToDebit: [''],
      maritalStatus: [''],
      nationality: [''],
      stateOfOrigin: [''],
      stateOfResidence: [''],
      localGovt: [''],
      employmentStats: [''],
      occupation: [''],
      employersName: [''],
      // Account Update
      phone: [''],
      email: [''],
      // End Account Update
      birthday: [null],
      address: [''],
      name: [''],
      employersAddress: [''],
      dateEmployed: [null],
      tierType: [''],
      secretAnswer: ['', Validators.required],
      // Reg ID
      regulatoryIDDOCFileName: [''],
      regulatoryIDFile: [''],
      regulatoryIDFileType: [''],
      // Utility
      utilityBillFileType: [''],
      utilityBillFileName: [''],
      utilityBillFile: [''],
      // Marriage Cert
      marrigeCertFileType: [''],
      marrigeCertFileName: [''],
      marrigeCertFile: [''],
      // NewPaper Pub
      newsPaperFileType: [''],
      newsPaperFileName: [''],
      newsPaperFile: [''],
      // Birth Cert
      birthCertFileType: [''],
      birthCertFileName: [''],
      birthCertFile: ['']
    });
    this.onChanges();
  }
  // Monitor changes to key form controls required for account upgrade
  onChanges(): void {
    merge(
      this.accountUpgradeForm.get('employersName').valueChanges,
      this.accountUpgradeForm.get('tierType').valueChanges,
      this.accountUpgradeForm.get('address').valueChanges,
      this.accountUpgradeForm.get('regulatoryIdNumber').valueChanges,
      this.accountUpgradeForm.get('gender').valueChanges,
      this.accountUpgradeForm.get('nationality').valueChanges,
      this.accountUpgradeForm.get('maritalStatus').valueChanges,
      this.accountUpgradeForm.get('occupation').valueChanges,
      this.accountUpgradeForm.get('stateOfOrigin').valueChanges,
      this.accountUpgradeForm.get('stateOfResidence').valueChanges,
      this.accountUpgradeForm.get('localGovt').valueChanges,
      this.accountUpgradeForm.get('employmentStats').valueChanges,
      this.accountUpgradeForm.get('employersAddress').valueChanges
    ).subscribe(() => {
      // this true if changes occure
      this.userUpdatedOtherInfo = true;
    });
  }
  // Account Upgrade onSubmit
  onSubmit(form) {
    if (this.accountUpgradeForm.valid) {
      // If email is changed use this object for an account update
      this.updateObject = {
        email: form.value.email,
        mobnum: form.value.phone,
        token: '',
        secretAnswer: form.value.secretAnswer
      };
      if (
        // If user updated the phone and email but didn't update other info
        this.userUpdatedEmailPhone === true &&
        this.userUpdatedOtherInfo === false
      ) {
        // change request type to update & open token modal
        this.requestTypeIs = 1;
        this.openTokenConfirmation();
      }
      if (
        // If user updated other info then decided to also update email and phone
        this.userUpdatedEmailPhone === true &&
        this.userUpdatedOtherInfo === true
      ) {
        // change request type to update & open token modal
        this.requestTypeIs = 1;
        this.openTokenConfirmation();
      }
      if (
        (this.userUpdatedEmailPhone === true &&
          this.userUpdatedOtherInfo === true &&
          !this.isEmailReadOnly) ||
        !this.isPhoneReadOnly
      ) {
        // change request type to update & open token modal
        this.requestTypeIs = 1;
        this.openTokenConfirmation();
      }
      if (
        // If user updated the phone and email but didn't update other info
        this.userUpdatedEmailPhone === false &&
        this.userUpdatedOtherInfo === false
      ) {
        this.setNotification('info', 'Error', `Nothing to Submit`);
      }
      if (
        this.userUpdatedOtherInfo === true &&
        this.userUpdatedEmailPhone === false
      ) {
        // If email is unchanged, Go ahead and submit
        this.doSubmit(form.value);
      }
    } else {
      // If form isn't valid
      this.isLoading = false;
      // Show invalid fields and console.log
      const invalidFields = this.util.findInvalidControls(
        this.accountUpgradeForm
      );
      console.log(invalidFields); // For dubugging purposes
      this.setNotification(
        'info',
        'Sorry',
        `You have some missing or invalid form inputs`
      );
      return;
    }
  }
  doSubmit(form) {
    this.isLoading = true;
    this.accountService.accountUpgrade(form).subscribe(
      (response: any) => {
        if (response.responseCode === '00') {
          this.isLoading = false;
          this.setNotification(
            'success',
            'Success!',
            `${response.responseDescription}`
          );
          this.isSuccess = true;
          this.createupgradeAcctForm();
        } else {
          // If not Success - Handle Error
          this.isLoading = false;
          this.setNotification(
            'error',
            'Error!',
            `${this.util.handleResponseError(response)}`
          );
        }
      },
      (error: HttpErrorResponse) => {
        this.message = this.util.handleResponseError(error);
        this.setNotification('error', 'Error!', `${this.message}`);
        this.isLoading = false;
      }
    );
  }
  // Method that opens the Token confirmation modal
  openTokenConfirmation() {
    // If request type is update
    if (this.requestTypeIs === 0) {
      this.tokenState = true;
      this.activeService = 'Account Update';
      this.accountUpdateForm.controls['email'].setValue(
        this.currentUserEmail[0]
      );
    }
    if (this.requestTypeIs === 1) {
      this.tokenState = true;
      this.activeService = 'Account Update';
    }
    this.formSubmit = true;
  }
  // OnSubmit of Token Run this event
  inititateService($event) {
    if (this.requestTypeIs === 0) {
      this.accountUpdateForm.controls['token'].setValue($event);
      this.accountUpdateOnSubmit(this.accountUpdateForm.value);
    }
    if (this.requestTypeIs === 1) {
      this.isLoading = true;
      this.updateObject.token = $event;
      this.accountService
        .accountUpdate(this.updateObject)
        .subscribe((res: any) => {
          this.formSubmit = false;
          this.isLoading = false;
          if (res && res.responseCode === '00') {
            // Show success notification
            this.setNotification(
              'success',
              'Account Updated!',
              `${res.responseDescription}`
            );
            this.isEmailReadOnly = true;
            this.isPhoneReadOnly = true;
            this.userUpdatedEmailPhone = false;
          } else {
            this.setNotification(
              'error',
              'Error!',
              `${this.util.handleResponseError(res)}`
            );
          }
        });
    }
  }
  // Patch form values when selected
  acctToUpdateHander($event: any) {
    this.accountUpdateForm.controls['acctToDebit'].patchValue($event);
  }
  // Uploaders
  set uploadNewsPaperPubFile($event: FileList) {}
  set uploadMarriageCertificateFile($event: FileList) {}
  set uploadBirthCertificateFile($event: FileList) {}
  // Reactive Form Definition
  createUpdateForm() {
    this.accountUpdateForm = this.fb.group({
      empaddr: [''],
      empdate: [''],
      email: [''],
      empname: [''],
      gradDate: [''],
      iddate: [''],
      mobnum: [''],
      taxid: [''],
      telnum1: [''],
      acctToDebit: ['', Validators.required],
      token: [''],
      secretAnswer: ['', Validators.required]
    });
  }
  // Actual Submit Function
  accountUpdateOnSubmit(form) {
    console.log(form);
    this.isLoading = true;
    this.submitStatus = true;
    this.accountService.accountUpdate(form).subscribe(
      (response: any) => {
        if (response && response.responseCode === '00') {
          this.isLoading = false;
          this.message = response.responseDescription;
          this.isSuccess = true;
          this.createUpdateForm();
        } else {
          this.isLoading = false;
          this.message =
            this.util.handleResponseError(response) || 'Something went wrong!';
        }
      },
      (error: HttpErrorResponse) => {
        this.message = error.toString();
        this.isLoading = false;
      }
    );
  }
  // CheckBox Control
  emailupdate() {
    this.emailInput.nativeElement.checked
      ? (this.email = true)
      : (this.email = false);
  }
  phonenumberupdate() {
    this.phonenumberInput.nativeElement.checked
      ? ((this.phone = true),
        this.accountUpdateForm
          .get('mobnum')
          .setValidators([Validators.required]),
        this.accountUpdateForm.get('mobnum').updateValueAndValidity())
      : ((this.phone = false),
        this.accountUpdateForm.get('mobnum').clearValidators(),
        this.accountUpdateForm.get('mobnum').updateValueAndValidity());
  }
  addressupdate() {
    this.addressInput.nativeElement.checked
      ? ((this.address = true),
        this.accountUpdateForm
          .get('email')
          .setValidators([Validators.required]),
        this.accountUpdateForm.get('email').updateValueAndValidity())
      : ((this.address = false),
        this.accountUpdateForm.get('email').clearValidators(),
        this.accountUpdateForm.get('email').updateValueAndValidity());
  }
  nameupdate() {
    this.nameInput.nativeElement.checked
      ? (this.name = true)
      : (this.name = false);
  }
  dateofbirthUpdate() {
    this.dobInput.nativeElement.checked
      ? (this.dateofbirth = true)
      : (this.dateofbirth = false);
  }
  // Notification Modal
  visibilityHandler($event) {
    if ($event === true) {
      this.notifications = {};
    }
  }
  setNotification(type, title, msg) {
    this.notifications.message = msg;
    this.notifications.title = title;
    this.notifications.type = type;
  }
}
