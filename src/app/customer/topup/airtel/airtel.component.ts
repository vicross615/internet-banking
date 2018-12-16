import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { UtilitiesService } from '../../../_services/utilities.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { AirtimeDataService } from '../airtime-data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-airtel',
  templateUrl: '../airtime.html',
  styleUrls: ['./airtel.component.scss'],
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
export class AirtelComponent implements OnInit, AfterViewInit {
  Title = 'Airtel AirTime & Data';
  activeService: any;
  productDetails; // Product details object.
  data_Bundles: Array<DataBundle> = [];
  AirtimeForm: FormGroup;
  // tslint:disable-next-line:no-inferrable-types
  requestTypeIs: number; // Defaults to Airtime Purchase, 1 for Data Purchase
  // Token modal objects
  public formSubmit = false;
  isSuccess: boolean;
  isLoading: boolean;
  form: any; // holds ngForm values
  message: any = null;
  submitStatus: boolean;
  public keypadNumbers = ['1000', '3000', '5000', '7000', '12000', '15000'];
  amountSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private util: UtilitiesService,
    private airtimeService: AirtimeDataService
  ) {
    this.airtimeService.toggle$.subscribe((res: any) => {
      this.requestType = res;
      this.AirtimeForm.controls['reqtype'].patchValue(res);
    });
  }

  ngOnInit() {
    this.requestTypeIs = 0;
    this.createAirtimeDataTransferForm();
    this.selectedProductDetails = this.requestTypeIs; // Load Airtime By default by calling this accessor
  }
  ngAfterViewInit() {
    this.watchForRepeatTransfers();
  }
  acctToDebitEventHander($event: any) {
    this.AirtimeForm.controls['acctToDebit'].patchValue($event);
  }

  createAirtimeDataTransferForm() {
    this.AirtimeForm = this.fb.group({
      acctToDebit: ['', Validators.required],
      network: [''],
      airtimeamount: [''],
      number: ['', Validators.required],
      secretAnsw: ['', Validators.required],
      token: [''],
      productdetails: [''],
      selectedbundle: [''],
      reqtype: ['0', Validators.required]
    });
  }
  // form toggle
  set requestType(value: number) {
    this.createAirtimeDataTransferForm();
    this.requestTypeIs = value;
    this.selectedProductDetails = this.requestTypeIs;
  }
  // Call service with the request
  set selectedProductDetails(request: number) {
    this.airtimeService.productDetailsForAirtimePurchase = request; // Call service with the request
    this.airtimeService.productDetailsService.subscribe((res: any) => {
      if (request === 0) {
        this.productDetails = res[3]; // Airtel
        this.AirtimeForm.controls['productdetails'].patchValue(
          this.productDetails
        );
      } else if (request === 1) {
        for (const i in res) {
          if (res[i].productnetwork === 'AIRTEL') {
            const data: DataBundle = {
              price: res[i].price,
              productbundle: res[i].productbundle,
              productid: res[i].productid,
              productname: res[i].productname
            };
            this.data_Bundles.push(data);
          }
        }
      }
    });
  }
  // Submit Form
  async onSubmit(form) {
    this.isLoading = true;
    await this.airtimeService.airtimeAndDataPurchase(form.value).subscribe(
      (res: any) => {
        if (res.responseCode === '00') {
          this.isLoading = false;
          this.message = res.responseDescription;
          this.isSuccess = true;
          this.createAirtimeDataTransferForm();
        } else {
          this.isLoading = false;
          this.message =
            this.util.handleResponseError(res) || 'Something went wrong!';
        }
      },
      (error: HttpErrorResponse) => {
        this.message = error.toString();
        this.isLoading = false;
      }
    );
  }
  // Calc Algo
  addAmount(value) {
    const input = parseInt(value, 10);
    let amt = this.AirtimeForm.controls['airtimeamount'].value;
    if (amt === '') {
      amt = 0;
    }
    amt = parseInt(amt, 10) + input;
    this.AirtimeForm.controls['airtimeamount'].patchValue(amt);
  }
  // Method that opens the Token confirmation modal
  openTokenConfirmation(form: NgForm) {
    if ((this.requestTypeIs = 0)) {
      const amount = this.AirtimeForm.controls.airtimeamount.value;
      const number = this.AirtimeForm.controls.number.value;
      const summary = `You are sending NGN ${amount} to ${number}`;
      this.activeService = summary;
    }
    if ((this.requestTypeIs = 1)) {
      const data = this.AirtimeForm.controls.selectedbundle.value;
      const number = this.AirtimeForm.controls.number.value;
      const summary = `You are sending ${data.productbundle} to ${number}`;
      this.activeService = summary;
    }
    this.form = form;
    this.formSubmit = true;
  }
  clearAmount() {
    this.AirtimeForm.controls['airtimeamount'].patchValue('');
  }
  inititateService($event) {
    this.AirtimeForm.controls['token'].patchValue($event);
    this.onSubmit(this.form);
  }
  clearError() {
    this.isSuccess = null;
    this.message = null;
    this.isLoading = false;
    this.formSubmit = false;
    this.amountSubmitted = false;
    this.activeService = '';
    this.ngOnInit();
  }
  watchForRepeatTransfers() {
    // check if is active
    this.airtimeService.nameofActiveAirtimeCompIS.subscribe((res: any) => {
      if (res) {
        const active = res;
        if (active.includes('MTN')) {
          this.airtimeService.formValuesForFrequentTopUp.subscribe(
            (response: any) => {
              console.log(response);
              if (response && response.number !== '') {
                this.createAirtimeDataTransferForm();
                if (response.type === 'AIRTEL') {
                  this.requestTypeIs = 1;
                  const productDetails: any = {
                    productid: response.paymenttype,
                    productname: response.producttype
                  };
                  this.AirtimeForm.controls['airtimeamount'].patchValue(
                    response.amount
                  );
                  this.AirtimeForm.controls['productdetails'].patchValue(
                    productDetails
                  );
                }
                if (response.type === 'DATA') {
                  this.requestTypeIs = 0;
                  const selectedbundle: any = {
                    price: response.amount,
                    productid: response.paymenttype,
                    productname: response.producttype
                  };
                  this.AirtimeForm.controls['selectedbundle'].patchValue(
                    selectedbundle
                  );
                }
                this.AirtimeForm.controls['number'].patchValue(response.number);
              }
            }
          );
        }
      }
    });
  }
}
export interface DataBundle {
  price: number;
  productbundle: string;
  productid: number;
  productname: string;
}
