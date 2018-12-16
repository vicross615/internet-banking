import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import { AcctToDebit } from '../../_customer-model/customer.model';
import { FileConverterService } from '../../../_services/file-converter.service';
import { AccountsService } from '../_services/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-secure-email',
  templateUrl: './secure-email.component.html',
  styleUrls: ['./secure-email.component.scss'],
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
export class SecureEmailComponent implements OnInit, OnDestroy {
  sendSecureEmailForm: FormGroup;
  transactionType: Array<any>;
  public accountToDebit: AcctToDebit = null;
  selectedTransType: any;
  accts: Array<AcctToDebit>;
  // Token modal objects
  public formSubmit = false;
  isSuccess: boolean;
  isLoading: boolean;
  form: any; // holds ngForm values
  message: any = null;
  activeService = 'Sending Secure Email';
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private util: UtilitiesService,
    private fileUploadService: FileConverterService,
    private accountsService: AccountsService
  ) {
    this.transactionType = [
      {
        id: '1',
        desc: 'Email Request to Account Officer'
      },
      {
        id: '2',
        desc: 'Recall of FX Outflow transfer'
      },
      {
        id: '3',
        desc: 'Amendment of FX Outflow transfer'
      },
      {
        id: '4',
        desc: 'Return of FX Inflow'
      },
      {
        id: '5',
        desc: 'Tracer of FX Inflow'
      },
      {
        id: '6',
        desc: 'Tracer of FX Outflow transfer'
      }
    ];
  }

  ngOnInit() {
    this.customerService.acctToDebit$.pipe(untilComponentDestroyed(this))
    .subscribe(res => (this.accts = res));
    this.createSendSecureEmailForm();
    this.selectedTransType = this.transactionType[0];
    this.sendSecureEmailForm.controls['transactionType'].patchValue(
      this.selectedTransType
    );
  }

  ngOnDestroy(): void {

  }

  createSendSecureEmailForm() {
    this.sendSecureEmailForm = this.fb.group({
      accountToDeBit: [''],
      mailSubject: [''],
      mailBody: [''],
      File: [''],
      FileType: [''],
      FileName: [''],
      secretAnswer: [''],
      customerEmailAddress: [''],
      transactionType: [''],
      /* token: [''] */
    });
  }
  acctToDebitEventHandler($event: any) {
    this.accountToDebit = $event;
    this.sendSecureEmailForm.controls['accountToDeBit'].patchValue($event);
  }
  optionSelected(option) {
    this.selectedTransType = option;
    this.sendSecureEmailForm.controls['transactionType'].patchValue(
      this.selectedTransType
    );
  }

  set uploadFile($event: FileList) {
    this.fileUploadService.onFileChanged($event);
    const selectedfileProperties = this.fileUploadService
      .uploadedFileProperties;
    // Form sending the selected file name.
    this.sendSecureEmailForm.controls['FileName'].patchValue(
      selectedfileProperties.name
    );
    // For File Type
    this.sendSecureEmailForm.controls['FileType'].patchValue(
      selectedfileProperties.type
    );
    // For Actual File
    setTimeout(() => {
      this.fileUploadService.fileObservable.pipe(untilComponentDestroyed(this))
      .subscribe(response => {
        this.sendSecureEmailForm.controls['File'].patchValue(response);
      });
    }, 1000);
    return;
  }
  onSubmit(form) {
    this.accountsService.sendSecureEmailService(form.value).pipe(untilComponentDestroyed(this))
    .subscribe(
      (response: any) => {
        console.log(response);
         if (response.responseCode === '00') {
          this.isLoading = false;
          this.isSuccess = true;
          this.message = response.responseDescription;
          this.sendSecureEmailForm.reset();
          this.ngOnInit();
        } else {
          this.isLoading = false;
          this.message =
            this.util.handleResponseError(response) || 'Something went wrong!';
        }
      },
      (error: HttpErrorResponse) => {
        this.message = error;
        this.isLoading = false;
      }
    );
  }
  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }
  // Method that opens the Token confirmation modal
  openTokenConfirmation(form: NgForm) {
    this.form = form;
    this.formSubmit = true;
  }
  inititateService($event) {
    /* this.sendSecureEmailForm.controls['token'].patchValue($event); */
    this.onSubmit(this.form);
  }
  clearError() {
    this.isSuccess = null;
    this.message = null;
    this.isLoading = false;
    this.formSubmit = false;
  }
}
