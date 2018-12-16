import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../_models/user';
import { LoginData } from '../../_models/logindata';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { environment } from '../../../environments/environment';
import { UtilitiesService } from '../../_services/utilities.service';
import { NotificationsService } from 'angular2-notifications';
import { CustomerService } from '../../customer/_customer-service/customer.service';
import { UserService } from '../../_services/user.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import * as JsEncryptModule from 'jsencrypt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../../../node_modules/sweetalert2/src/sweetalert2.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  user: User;
  logindata: LoginData;
  loading: boolean;
  loginError: string;
  public options = {
    position: ['bottom', 'right'],
  };

  public keypadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  constructor(
    private notifications: NotificationsService,
    private fb: FormBuilder,
    private auth: AuthService,
    private util: UtilitiesService,
    private userService: UserService,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.createForm();
    this.keypadNumbers = this.shuffleKeyPad(this.keypadNumbers);
    let userName = (localStorage.getItem('userName') ? localStorage.getItem('userName') : '');
    console.log(userName);
    userName = this.util.decrypt(userName);
    this.loginForm.controls['Username'].setValue(userName);
  }

  createForm() {
    const reqID = this.util.generateNumber();
    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      RememberMe: '',
      RequestID: reqID,
      Channel: environment.CHANNEL
    });
  }

  shuffleKeyPad(keyArray: any[]) {
    let c = keyArray.length;
    while (c > 0) {
      const i = Math.floor(Math.random() * c);
      c--;
      const t = keyArray[c];
      keyArray[c] = keyArray[i];
      keyArray[i] = t;
    }
    return keyArray;
  }

  //  loginUser() {
  //    console.log(formdata.value);
  //    this.user.loginUser(formdata)
  //  }

  ngOnInit() {
    this.customerService.getAcctDetailsData();
    this.auth.ibankLogout();
  }

  ngOnDestroy(): void {

  }

  onSubmit(formdata) {
    console.log(formdata);
    if (formdata.RememberMe === true) {
      const userName = this.util.encrypt(formdata.Username);
      console.log(userName);
      localStorage.setItem('userName', userName);
    }
    this.loading = true;
    this.notifications.remove('loginError'); // remove login notification
    this.notifications.html(
      `Logging in... <i class="fas fa-spin fa-circle-notch ml-3"></i>`,
      'info',
      {
        id: 'login',
        timeOut: 20000,
        showProgressBar: true,
        animate: 'scale'
      }
    );

    this.auth.login(formdata)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        console.log(res);
        this.getOnboardingJourney(res);
      },
      (err: HttpErrorResponse) => {
        this.notifications.remove('login'); // remove login notification
        this.errorAlert(err);
        console.log(err);
      }
      );
    this.loading = false;
  }

  // User Authentication
  getOnboardingJourney(res) {
    this.loginError = null;
    if (res.responseCode === '00' || res.responseCode === '04') {// if Login is successful
      this.user = res.userDetails;
      this.storeUserDetails(this.user);
      this.checkUserStatus(res);
    } else {
      this.notifications.remove('login'); // remove login notification
      this.loginError = res.responseDescription.replace('Validation Failure -', '');
      this.errorAlert(this.loginError);
      console.log(res);
      console.log(this.loginError); // Delete later
    } // Login returned error

  }

  errorAlert(message: any) {
    this.notifications.html(
      `<span class="f-12">${message}</span>`,
      'error',
      {
        id: 'LoginError',
        timeOut: 10000,
        showProgressBar: true,
        animate: 'scale'
      }
    );
  }

  storeUserDetails(user: User) {
    this.userService.updateUser(user);
    localStorage.setItem('userDetails', JSON.stringify(user));
    // localStorage.removeItem('userDetails');
    const users = JSON.parse(localStorage.getItem('userDetails'));
    console.log('User details stored in local storage'); // delete later
    console.log(users); // delete later
  }

  closeAlert() {
    this.loginError = null;
  }

  fetchCustomerData() {
    this.customerService.getAcctDetailsData();
    this.customerService.getAcctToDebitData();
  }

  addPasswordString(value) {
    let key = this.loginForm.controls['Password'].value;
    key = key + value;
    this.loginForm.controls['Password'].setValue(key);
  }

  clearPasswordString() {
    this.loginForm.controls['Password'].setValue('');
  }

  deletePasswordString() {
    let PwString = this.loginForm.controls['Password'].value;
    PwString = PwString.slice(0, -1);
    this.loginForm.controls['Password'].setValue(PwString);
  }

  checkUserStatus(res) {
    const checkStatus = JSON.parse(localStorage.getItem('userDetails'));
    console.log(checkStatus + 'authenticate');
    if (
        (checkStatus.reminderAnswer === 'NULL' || checkStatus.reminderAnswer === '' || checkStatus.reminderAnswer === null) ||
        (checkStatus.reminderQuestion === 'NULL' || checkStatus.reminderQuestion === '' || checkStatus.reminderQuestion === null)
        ) {
      this.router.navigate(['onboarding/setsecret-question']);
    } else if (checkStatus.pwdChangeRequired === '1') {
      this.router.navigate(['onboarding/reset-password']);
    } else if (checkStatus.transferIndemnityStatus === '0' || checkStatus.termsConditions === '0' ) {
      // Api not updating terms and condition when adjusted add this condition checkStatus.termsConditions === '0' ||
      this.router.navigate(['onboarding/indemnity']);
    } else {
      this.authenticateUser(res);
    }

  }

  authenticateUser(res) {
    localStorage.setItem('userToken', res.sessionId); // Store user session ID
    console.log(res); // delete later
    this.notifications.remove('login'); // remove login notification
    setTimeout(() => {
      this.fetchCustomerData();
      this.router.navigate(['/dashboard']);
    }, 300);

  }

}
