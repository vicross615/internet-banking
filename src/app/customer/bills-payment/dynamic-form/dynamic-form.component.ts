import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormFields, Biller, Product, Category, ValidationDetails } from '../_model/bills-payment.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BillsPaymentService } from '../_services/bills-payment.service';
import { transition, animate, trigger, style, state } from '@angular/animations';
import { UtilitiesService } from '../../../_services/utilities.service';
import { ActivatedRoute } from '@angular/router';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
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
    ]),
    trigger('slideUpDown', [
      state('in', style({ height: '*' })),
      transition('* => void', [
        style({ height: '*' }),
        animate('300ms ease-in', style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate('300ms ease-in', style({ height: '*' }))
      ]),
    ])
  ]
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formDataObject: FormFields[];
  category: Category;
  biller: Biller;
  billerFromURL: any;
  product: Product;
  public dynamicForm: FormGroup;
  public tokenValidationForm: FormGroup;
  isLoading = true;
  isValidating: boolean;
  changelog: string[] = [];
  errorMessage: string;
  formValidated: boolean;
  paying: boolean;
  validationReqBody: any = {};
  validationDetails: ValidationDetails;
  showValidationDetails = true;
  validationError = null;
  postingReqBody: any = {};
  notifications: IbankNotifications = {};
  accountToDebit: AcctToDebit = null;
  autobillForm: FormGroup;
  frequencies = [{ code: 1, name: 'Daily' }, {code: 2, name: '7 Days'}, { code: 3, name: 'Bi-Weekly'},
  {code: 4, name: '30 Days'}, {code: 5, name: '3 Months'}, {code: 6, name: '6 Months'},
  {code: 7, name: '12 Months'}, ];

constructor(
  private fb: FormBuilder,
  private billsPaymentService: BillsPaymentService,
  public util: UtilitiesService,
  private aroute: ActivatedRoute
) {
  this.aroute.params.subscribe((params: any) => this.billerFromURL = params);
  this.billsPaymentService.selectedCategory$.subscribe(cat => this.category = cat);
  this.billsPaymentService.selectedBiller$.subscribe(biller => this.biller = biller);
  this.billsPaymentService.selectedproduct$.subscribe(prod => this.product = prod);
  this.billsPaymentService.productsError$.subscribe(msg => {
    this.errorMessage = msg;
    if (this.errorMessage) {
      this.isLoading = false;
      this.setNotification(
        'info',
        'An Error Occured',
        this.errorMessage
      );
    }
  });
  this.billsPaymentService.validationDetails$.subscribe(v => {
    this.validationDetails = v;
    if (this.validationDetails) {
      this.isValidating = false;
    }
  });
  this.billsPaymentService.validationDetailsError$
    .subscribe(err => {
      this.validationError = err;
      if (this.validationError) {
        this.isValidating = false;
        this.setNotification(
          'info',
          'Validation Info',
          this.validationError
        );
      }
    });
}

acctToDebitEventHander($event: any) {
  this.accountToDebit = $event;
  console.log('parent: ' + JSON.stringify(this.accountToDebit));
  this.tokenValidationForm.controls['acctToDebit'].patchValue($event);
}

ngOnInit() {
  console.log('ngOninit');
  this.createTokenValidationForm();
  this.createAutobillForm();
}

setNotification(type, title, msg) {
  this.notifications.message = msg;
  this.notifications.title = title;
  this.notifications.type = type;
}

visibilityHandler($event) {
  if ($event === true) {
    this.notifications = {};
    this.isLoading = false;
    this.paying = false;
    this.billsPaymentService.updateProductsError(null);
    this.billsPaymentService.updateValidationDetailsError(null);
    this.billsPaymentService.updateFormFieldsError(null);
    this.errorMessage = null;
  }
}

ngOnDestroy(): void {
  this.notifications = {};
  this.billsPaymentService.updateValidationDetailsError(null);
  this.billsPaymentService.updateValidationDetails(null);
}

ngOnChanges(changes: SimpleChanges) {
  this.isLoading = true;
  this.errorMessage = '';
  if (this.formDataObject) {
    console.log(this.formDataObject);
    this.createDynamicForm();
    if (changes.formDataObject.firstChange === true) {
      console.log(changes.formDataObject.firstChange + ': Form has been changed by component controller. First change');
    } else {
      console.log(changes.formDataObject.firstChange + ': Form has been changed by new product selection.');
    }
  }
}

createDynamicForm() {
  const formGroup: any = {};
  this.formDataObject.forEach(field => {
    formGroup[field.field_name] = ((field.field_mandatory === '1' || field.data_retrieve === 1)) ?
      new FormControl(
        { value: field.actual_value || field.default_value, disabled: (field.dataSource === 1 || field.read_only === 1) },
        Validators.compose([Validators.required, Validators.maxLength(field.field_length)])
      )
      : new FormControl(
        { value: field.actual_value || field.default_value, disabled: (field.dataSource === 1) },
        Validators.maxLength(field.field_length));
  });
  // for (const field of this.formDataObject) {
  //   formGroup[field.field_name] = new FormControl({value: field.default_value, disabled: (field.dataSource === 1) });
  // }
  // console.log(JSON.stringify(formGroup));
  this.dynamicForm = new FormGroup(formGroup);
  this.isLoading = false;
}

createTokenValidationForm() {
  this.tokenValidationForm = this.fb.group({
    'acctToDebit': [this.accountToDebit, Validators.required],
    'autobill': [false, Validators.required],
    'secretAnsw': ['', Validators.required],
    'token': ['', Validators.compose([Validators.required, Validators.maxLength(6)])]
  });
}

createAutobillForm() {
  this.autobillForm = this.fb.group({
    'frequency': [0, Validators.required],
    'startDate': '',
    'stopDate': '',
  });
}

// private mapValidators(validator) {
//   const formValidators = [];
//   if (validator === '1') {
//     formValidators.push(Validators.required);
//   } else if (validator === '0') {
//     formValidators.push('');
//   }
//   return formValidators;
// }

validate() {
  this.validationError = null;
  this.isValidating = true;
  this.billsPaymentService.updateValidationDetails(null);
  console.log(JSON.stringify(this.dynamicForm.value));
  console.log(this.formDataObject);
  this.addActualValue();
  this.createValidationRequestBody();
  this.submitValidation();
}

addActualValue() {
  this.formDataObject.forEach((field: FormFields) => {
    console.log(field.actual_value); // Delete
    field.actual_value = (this.dynamicForm.controls[field.field_name].value) ?
      this.dynamicForm.controls[field.field_name].value : null;
    console.log(field.actual_value); // Delete
  });
  console.log(this.formDataObject); // Delete
  this.billsPaymentService.updateFormFields(this.formDataObject);
}

createValidationRequestBody() {
  this.validationReqBody = this.util.addAuthParams(this.validationReqBody);
  this.validationReqBody.accountToDebit = '';
  this.validationReqBody.customerId = (this.biller) ? this.biller.customerId : this.billerFromURL.billerId;
  this.validationReqBody.formId = this.formDataObject[0].form_id;
  this.validationReqBody.formFields = this.formDataObject;
  delete this.validationReqBody.customerNumber;
  console.log(this.validationReqBody);
}

submitValidation() {
  console.log(this.validationReqBody);
  this.billsPaymentService.getValidationDetailsData(this.validationReqBody);
}

closeAlert() {
  this.errorMessage = '';
}

postCollection(v) {
  this.paying = true;
  this.notifications = {};
  this.createPostingReqBody();
  this.submitPosting();
  console.log('initiate posting');
}

createPostingReqBody() {
  this.postingReqBody = this.util.addAuthParams(this.postingReqBody);
  this.postingReqBody.customerId = (this.biller) ? this.biller.customerId : this.billerFromURL.billerId;
  this.postingReqBody.formId = this.formDataObject[0].form_id;
  this.postingReqBody.accountToDebit = this.tokenValidationForm.controls['acctToDebit'].value.fullAcctKey;
  this.postingReqBody.accountToCredit = this.validationDetails.accountToCredit;
  this.postingReqBody.authMode = 'TOKEN';
  this.postingReqBody.authValue = this.tokenValidationForm.controls['token'].value;
  this.postingReqBody.paymentMode = '2';
  this.postingReqBody.autoBill = this.tokenValidationForm.controls['autobill'].value;
  this.postingReqBody.secretAnswer = this.tokenValidationForm.controls['secretAnsw'].value;
  this.postingReqBody.validationRef = this.validationDetails.validationRef;
  this.postingReqBody.autoBill_StartDate = this.autobillForm.controls['startDate'].value;
  this.postingReqBody.autoBill_StopDate = this.autobillForm.controls['stopDate'].value;
  this.postingReqBody.autoBill_Frequency = Number(this.autobillForm.controls['frequency'].value);
  this.postingReqBody.formFields = this.validationDetails.formFieldsDetails;
  this.postingReqBody.formCharges = this.validationDetails.formCharges;
  this.postingReqBody.formChargesSplit = this.validationDetails.formChargeSplit;
  delete this.validationReqBody.customerNumber;
  console.log(this.postingReqBody);
}

submitPosting() {
  console.log(this.postingReqBody);
  this.billsPaymentService.postingCollection(this.postingReqBody).subscribe(
    (res: any) => {
      console.log(res); // Delete
      if (res.responseCode === '00') {
        this.paying = false;
        this.setNotification(
          'success',
          'Successful',
          `<ul class="text-dark text-left f-14 mt-4">
              <li *ngIf="res.transId" class="p-2 mb-1 bg-light b-radius-5">
              <span class="f-w-500">Transaction ID: </span>
              <span class="float-right">
              ${res.transId}
              </span>
              </li>
              <li *ngIf="res.transRef" class="p-2 mb-1 bg-light b-radius-5">
              <span class="f-w-500">Transaction Ref: </span>
              <span class="float-right">
              ${res.transRef}
              </span>
              </li>
              <li class="p-2 mb-1 bg-light text-center text-success f-w-500 b-radius-5">
                Your Transaction was successful!
                </li>
            </ul>`
        );
      } else {
        this.paying = false;
        this.setNotification(
          'error',
          'Transaction Error',
          `${this.util.handleResponseError(res)}`
        );
      }
    },
    (err: HttpErrorResponse) => {
      console.log(err);
      this.setNotification(
        'error',
        'Transaction Error',
        `${err}`
      );
    }
  );
}

toggleValidationDetails() {
  this.showValidationDetails = !this.showValidationDetails;
}

backtoValidationForm() {
  this.isValidating = false;
  this.validationDetails = null;
  this.billsPaymentService.updateValidationDetails(null);
  this.billsPaymentService.updateValidationDetailsError(null);
}

}
