import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {OnboardingService} from '../onboarding.service';
import { trigger, transition, animate, style } from '@angular/animations';
import {UtilitiesService} from '../../_services/utilities.service';
import { createElementCssSelector } from '@angular/compiler';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-setsecret-question',
  templateUrl: './setsecret-question.component.html',
  styleUrls: ['./setsecret-question.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ],
})

export class SetsecretQuestionComponent implements OnInit, OnDestroy {

  setQandAForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  loading: boolean;

  constructor(
    private onboardingService: OnboardingService,
     private fb: FormBuilder,
     private router: Router,
     private util: UtilitiesService, ) {
     this.createForm();
   }

   createForm() {
    this.setQandAForm = this.fb.group({
      'secQuestion': ['', Validators.required],
      'secAnswer': ['', Validators.required],
    });

   }

  ngOnInit() {
    this.loading = false;
  }

  ngOnDestroy(): void {

  }

  onSubmitSetSecret() {

    const body = this.setQandAForm.value;
    console.log(body);
      this.onboardingService.setSecretQuestion(body)
      .pipe(untilComponentDestroyed(this)).subscribe(
        (res) => {
            console.log(res);
            if (res.responseCode === '00') {
              this.checkStatus(res);
            } else {
              this.errorMessage = 'error:' + res.responseDescription;
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

  closeAlert() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  checkStatus(res) {
    const checkUserStatus = JSON.parse(localStorage.getItem('userDetails'));
    if (checkUserStatus.pwdChangeRequired === '1') {
      this.router.navigate(['onboarding/reset-password']);
    } else if (checkUserStatus.transferIndemnityStatus === '0') {
      this.router.navigate(['onboarding/indemnity']);
    } else {
      this.logUserToDashboard(res);
    }
  }

  logUserToDashboard(res) {
    localStorage.setItem('userToken', res.sessionId);
    this.router.navigate(['/dashboard']);
  }

}
