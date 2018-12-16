import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../_models/user';
import { LoginData } from '../../_models/logindata';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { UtilitiesService } from '../../_services/utilities.service';
import { NotificationsService } from 'angular2-notifications';
import { CustomerService } from '../../customer/_customer-service/customer.service';
import { UserService } from '../../_services/user.service';
import { OnboardingService } from '../onboarding.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-indemnity',
  templateUrl: './indemnity.component.html',
  styleUrls: ['./indemnity.component.scss']
})
export class IndemnityComponent implements OnInit, OnDestroy {

  indemnityForm: FormGroup;
  user: User;
  logindata: LoginData;
  loading: boolean;
  loginError: string;
  errorMessage: string;
  successMessage: string;

  constructor(
    private notifications: NotificationsService,
    private fb: FormBuilder,
    private auth: AuthService,
    private util: UtilitiesService,
    private userService: UserService,
    private router: Router,
    private customerService: CustomerService,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  onSubmit() {
    this.loading = true;
    this.onboardingService.updateIndemnityStatus()
    .pipe(untilComponentDestroyed(this))
      .subscribe(
      (res: any) => {
        console.log(res);
       // res.responseCode = '00';  //Just for testing;
        if (res.responseCode === '00') {
          localStorage.setItem('userToken', res.sessionId);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Error Occured:' + res.responseDescription;
          this.successMessage = null;
          this.loading = false;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
      );
  }

  closeAlert() {
    this.successMessage = null;
    this.errorMessage = null;

  }

  /*
   checkStatus(res) {
  const checkUserStatus = JSON.parse(localStorage.getItem('userDetails'));
  if (checkUserStatus.pwdChangeRequired === '1') {
    this.router.navigate(['onboarding/reset-password']);
  }
  else if (checkUserStatus.reminderAnswer === 'NULL' || checkUserStatus.reminderQuestion === 'NULL' ) {
    this.router.navigate(['onboarding/setsecret-question']);
  }else{
    this.logUserToDashboard(res)
  }
}
logUserToDashboard(res){
  localStorage.setItem('userToken', res.sessionId);
  this.router.navigate(['/dashboard']);
}
  */
}
