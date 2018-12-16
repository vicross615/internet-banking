import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration/registration.service';
import { environment } from '../../../environments/environment';
import { UtilitiesService } from '../../_services/utilities.service';
import { CustomerService } from '../../customer/_customer-service/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, animate, transition, state, style } from '@angular/animations';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-reg',
  templateUrl: './registration.component.html',
  styleUrls: ['../onboarding.component.scss'],
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
        animate('300ms', style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate('300ms', style({ height: '*' }))
      ]),
    ])
  ],
})

export class RegistrationComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  errorMessage: any;
  successMessage: string;
  loading = false;
  otpMessage: any;
  otpRequest: boolean;

  constructor(
    public auth: RegistrationService,
    private fb: FormBuilder,
    private util: UtilitiesService,
    private customerService: CustomerService
  ) {
    this.createRegForm();
  }

  onSubmitRegister(formValues) {
    this.loading = true;
    console.log(formValues);
    this.auth.register(formValues)
      .pipe(untilComponentDestroyed(this)).subscribe(
        (res: any) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.successMessage = res.responseDescription;
            this.errorMessage = null;
            this.loading = false;
            this.closeAlertSucess();
          } else {
            this.errorMessage = this.util.handleResponseError(res);
            this.successMessage = null;
            this.loading = false;
            this.closeAlert();
          }
          this.registerForm.reset();
        },
        (err: HttpErrorResponse) => {
          console.error('Session is expired, please Login');
          console.log(err);
          this.errorMessage = (err);
          this.loading = false;
        }
      );
  }

  closeAlertSucess() {
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);

  }

  closeAlert() {
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  createRegForm() {
    this.registerForm = this.fb.group({
      AccountNumber: ['', Validators.required],
      Pin: ['', Validators.required],
      Otp: ['', Validators.required],
      // checkbox: ['', Validators.required],
    });
  }

  onkey(acct: any) {
    if (acct.length === 10) {
      this.requestOtp();
    }
  }

  public requestOtp() {
    this.otpMessage = 'Sending OTP request...';
    console.log(this.registerForm.value.AccountNumber);
    this.auth.getOTP(this.registerForm.value.AccountNumber)
      .pipe(untilComponentDestroyed(this)).subscribe(
        (res: any) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.otpMessage = res.responseDescription;
          } else {
            this.otpMessage = this.util.handleResponseError(res);
          }
          setTimeout(() => {
            this.otpMessage = '';
          }, 10000);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.otpMessage = err;
        }
      );
  }

}
