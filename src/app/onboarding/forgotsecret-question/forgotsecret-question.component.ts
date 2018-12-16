import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration/registration.service';
import { environment } from '../../../environments/environment';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-forgotsecret-question',
  templateUrl: './forgotsecret-question.component.html',
  styleUrls: ['./forgotsecret-question.component.scss']
})
export class ForgotsecretQuestionComponent implements OnInit, OnDestroy {

  forgotSecAnswer: FormGroup;
  loading: boolean;
  errorMessage: string;
  successMessage: string;

  constructor(public onboardingSecretAnswer: RegistrationService, private fb: FormBuilder) {

    this.forgotSecAnswer = fb.group({
      username: ['', Validators.required],
      // secretAnswer: ['', Validators.required]
    });

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }



  onSubmitForgotPwd() {
         this.loading = true;
    console.log(this.forgotSecAnswer.value);

    this.onboardingSecretAnswer.ForgotSecretAnswer(this.forgotSecAnswer.value.username)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.successMessage = 'Secret Answer Request successful :' + res.responseDescription;
            this.errorMessage = null;
            this.loading = false;

          } else {
            this.errorMessage = 'Request Failed :' + res.responseDescription;
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
    this.successMessage = null;
  }

}
