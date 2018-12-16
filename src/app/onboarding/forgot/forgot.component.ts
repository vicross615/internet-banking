import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration/registration.service';
import { environment } from '../../../environments/environment';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})


export class ForgotComponent implements OnInit, OnDestroy {

  forgotPwd: FormGroup;
  errorMessage: string;
  successMessage: string;
  loading = false;

  constructor(public fgtpwd: RegistrationService, private fb: FormBuilder) {
    this.forgotPwd = fb.group({
      username: ['', Validators.required],
      secretAnswer: ['', Validators.required]
    });

  }


  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
  }

  ngOnDestroy(): void {

  }

  onSubmitForgotPwd() {
     this.loading = true;
    console.log(this.forgotPwd.value);

    this.fgtpwd.ForgotPassword(this.forgotPwd.value.username, this.forgotPwd.value.secretAnswer)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.successMessage = 'Password Request successful :' + res.responseDescription;
            this.loading = false;
            this.errorMessage = null;
          } else {
            this.errorMessage = 'Password Request Failed :' + res.responseDescription;
            this.successMessage = null;
            this.loading = false;
          }
      },
      err => {
        console.error('Session is expired, please Login');
        console.log(err);
      }
    );
    this.loading = false;
  }


  closeAlert() {
    this.errorMessage = null;
  }

  closeAlertSuccess() {
    this.successMessage = null;
  }
}
