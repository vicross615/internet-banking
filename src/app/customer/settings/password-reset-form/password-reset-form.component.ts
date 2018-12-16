import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordresetService } from '../password-reset/passwordreset.service';
import { UtilitiesService } from '../../../_services/utilities.service';
import { createElementCssSelector } from '@angular/compiler';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.scss'],
})
export class PasswordResetFormComponent implements OnInit, OnDestroy {

  passwordReset: FormGroup;
  errorMessage: string;
  successMessage: string;
  loading: boolean;

  constructor(
    private pwdResetService: PasswordresetService,
    private fb: FormBuilder,
    private router: Router,
    private util: UtilitiesService, ) {
    this.createForm();
  }


  createForm() {
    this.passwordReset = this.fb.group({
      'PasswordOld': ['', Validators.required],
      'PasswordNew': ['', Validators.required],
      'PasswordConfirm': ['', Validators.required]
    });

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  onSubmitPwdChange() {
    this.loading = true;
    const userToken = JSON.parse(localStorage.getItem('userToken'));
    if (userToken === null || userToken === '') {
      this.checkUserStatus();
    } else {
      const body = this.passwordReset.value;
      console.log(body);
      this.userAlreadyLogged(body);
    }


  }

  closeAlert() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  userAlreadyLogged(body) {

    this.pwdResetService.PassWordReset(body)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.successMessage = 'Password Change Successful :';
          this.createForm();
          this.loading = false;
        } else {
          this.errorMessage = 'Cannot change password at the moment:' + res.responseDescription;
          this.loading = true;
        }
      },
      err => {
        this.errorMessage = this.util.handleResponseError(err);
        console.log(err);
      }
    );
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;

    }, 3000);
  }

  checkUserStatus() {
    const checkStatus = JSON.parse(localStorage.getItem('userDetails'));
    const body = this.passwordReset.value;
    this.pwdResetService.PassWordReset(body)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res) => {
        console.log(res);
        if (res.responseCode === '00') {
          if (checkStatus.transferIndemnityStatus === '0' || checkStatus.termsConditions === '0') {
            this.router.navigate(['onboarding/indemnity']);
          } else {
            localStorage.setItem('userToken', res.sessionId);
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage = 'Cannot change password at the moment:' + res.responseDescription;
        }
      },
      err => {
        this.errorMessage = this.util.handleResponseError(err);
        console.log(err);
      }
    );

  }
}
