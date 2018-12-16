import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { transition, trigger, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AcctManagerService } from '../../_services/acct-manager.service';
import { AcctMngrResponse, DefaultResponse, AcctManagersList, AcctMgrs } from '../../_models/account-manager';
import { AcctDetails } from '../_customer-model/customer.model';
import { CustomerService } from '../_customer-service/customer.service';
import { UtilitiesService } from '../../_services/utilities.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: [
    './accounts.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AccountsComponent implements OnInit, OnDestroy {
  public commentForm: FormGroup;
  public default: DefaultResponse;
  public showDetails: boolean;
  public acctManagers: Array<AcctMgrs>;
  public selectedAcctManager: AcctMgrs;
  public countAcctMgrs: Array<any> = [];
  public itemNo: any[];
  public userDetails: any;
  public accounts: AcctDetails[];
  public selectedAcct: AcctDetails;
  public loading: boolean;
  public error: string;
  public acctOfficer: AcctMngrResponse;
  public config: any;
  public srcUrl: string;
  public srcUrlAcctMgrs: string[];
  public fullName: string;
  public email: string;
  public branchLocation: string;
  public phoneNumber: string;
  public errorMessage: string;
  public successMessage: string;
  public bankingExperience: number;
  public branchArray: string[];
  public showSwitchbtn: boolean;
  public showComment: boolean;
  public reason: string;
  public oldAcctManager: string;
  public newAcctManager: string;

  // public  reqBody = {};
  startDate: any = new Date();
  stopDate: any = new Date();
  ratingString = 'Rate me';

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private customerService: CustomerService,
    private AMS: AcctManagerService,
    private util: UtilitiesService,
  ) {
    setTimeout(() => {
      this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
      .subscribe(accts => this.accounts = accts);
      this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
      .subscribe(selected => this.selectedAcct = selected);
    }, 1000);
  }

  ngOnInit() {
    this.showAcctMngr();
    this.createForm();
  }

  ngOnDestroy(): void {

  }

  createForm() {
    this.commentForm = this.fb.group({
      comment: [''],
    });
  }

  showAcctMngr() {
    this.acctOfficer = JSON.parse(localStorage.getItem('acctOfficer'));
    this.AMS.getAcctManagerDetails().pipe(untilComponentDestroyed(this))
      .subscribe(
      (res: AcctMngrResponse) => {
        // Remove this before production
        console.log(res);
        if (res.responseCode === '00') {
          // disable switch button
          this.acctOfficer = res;
          if (this.acctOfficer.staffDetails === null || this.acctOfficer.staffPicture === null) {
            localStorage.setItem('acctOfficer', JSON.stringify(this.acctOfficer));
            this.srcUrl = 'assets/images/user-card/AcctMgr.png';
            console.log(this.srcUrl);
            this.phoneNumber = '08029002900';
            this.email = 'gtconnect@gtbank.com';
            this.fullName = 'GTCONNECT',
            this.showSwitchbtn = false;
          } else {
            console.log('this Account Officer detail ' + JSON.stringify(this.acctOfficer));
            localStorage.setItem('acctOfficer', JSON.stringify(this.acctOfficer));
            this.srcUrl = 'data:' + this.acctOfficer.staffPicture.mimeType + ';base64,' + this.acctOfficer.staffPicture.photo;
            console.log(this.srcUrl);
            if (this.acctOfficer.staffDetails.branchLocation == null) {
              this.branchArray = [];
            } else {
              this.branchArray = this.acctOfficer.staffDetails.branchLocation.split('(');
            }
            this.branchLocation = this.branchArray[0];
            this.phoneNumber = this.acctOfficer.staffDetails.phoneNumber;
            this.email = this.acctOfficer.staffDetails.email;
            this.bankingExperience = this.acctOfficer.staffDetails.yearsOfBankingExperience;
            this.fullName = this.acctOfficer.staffDetails.fullName;
            this.showSwitchbtn = true;
          }
        }
        console.log(this.srcUrl);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorMessage = JSON.stringify(err);
      }
      );
  }

  changeRating(rating) {
    this.ratingString = rating;
  }

  selectedAcctMgr(acctMgrDetails) {
    this.selectedAcctManager = acctMgrDetails;
    console.log(this.selectedAcctManager);
  }

  clearError() {
    this.successMessage = null;
    this.errorMessage = null;
  }

  backbtn() {
    this.acctManagers = null;
  }

  showCommentM() {
    this.showComment = true;
  }

  clearComment() {
    this.showComment = false;
  }
  rateAccountManger() {
    this.clearError();
    this.showComment = false;
    const acctOfficerDetails = JSON.parse(localStorage.getItem('acctOfficer'));
    const reqBody: any = {};
    if (acctOfficerDetails.staffDetails === null || acctOfficerDetails.staffDetails === '') {
      reqBody.AcctOfficerUsername = 'GTCONNECT';
      reqBody.AccountMgrTeam = '999';
    } else {
      reqBody.AcctOfficerUsername = acctOfficerDetails.staffDetails.userName;
      reqBody.AccountMgrTeam = acctOfficerDetails.staffDetails.department;
    }

    reqBody.Rating = this.ratingString;
    if (this.commentForm.value.comment === '' || this.commentForm.value.comment === null) {
      reqBody.comment = 'No Comment by User';
    } else {
      reqBody.comment = this.commentForm.value.comment;
    }
    console.log(reqBody);
    this.AMS.rateAccountManager(reqBody).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.successMessage = 'Rating is Successfull';
          this.errorMessage = null;
        } else {
          this.errorMessage = this.util.handleResponseError(res);
          this.successMessage = null;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorMessage = JSON.stringify(err);
      }
    );

    setTimeout(() => {
      this.clearError();
    }, 3000);
  }

  showAccountManagerList() {
    this.loading = true;
    const acctOfficerDetails = JSON.parse(localStorage.getItem('acctOfficer'));
    console.log('Account officer details from local storage:' + JSON.stringify(acctOfficerDetails));

    const reqBody = {
      'AcctMgrId': acctOfficerDetails.accountManager.id,
      'BranchCode': acctOfficerDetails.accountManager.branchLocation,
      // 'UserId': acctOfficerDetails.accountManager.userName,
    };
    console.log(reqBody);
    this.AMS.accountManagerListinBranch(reqBody).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.acctManagers = res.accountMgrs;
          console.log(this.acctManagers);
          this.loading = false;
        } else {
          this.errorMessage = 'Error Occured : Unable to load account Managers Please try again later';
          this.successMessage = null;
          this.loading = false;
        }
      },
      (err: HttpErrorResponse) => { console.log(err); }
    );

  }

  switchAccountManager() {
    this.loading = true;
    const acctOfficerDetails = JSON.parse(localStorage.getItem('acctOfficer'));
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log('Account officer details from local storage:' + JSON.stringify(acctOfficerDetails));
    if (this.commentForm.value.comment === '' || this.commentForm.value.comment === null) {
      this.reason = 'Reason not given by User';
    } else {
      this.reason = this.commentForm.value.comment;
    }
   this.oldAcctManager = acctOfficerDetails.staffDetails.fullName;
   this.newAcctManager =  this.selectedAcctManager.fullName;

    const reqBody = {
      'OldAcctMgrID': acctOfficerDetails.accountManager.id,
      'OldAcctMgrName': acctOfficerDetails.staffDetails.fullName,
      'NewAcctMgrID': this.selectedAcctManager.id,
      'NewAcctMgrName': this.selectedAcctManager.fullName,
      'comment': this.reason,
    };
    console.log(reqBody);
    this.AMS.switchAccountManager(reqBody).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.successMessage = 'Account Manager Switch Successfull';
          this.showAcctMngr();
          this.acctManagers = null;
          this.errorMessage = null;
          this.loading = false;
        } else {
          this.errorMessage = 'Error Occured : Unable to load account Managers Please try again later';
          this.successMessage = null;
          this.loading = false;
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );

    setTimeout(() => {
      this.clearError();
    }, 6000);
  }
}
