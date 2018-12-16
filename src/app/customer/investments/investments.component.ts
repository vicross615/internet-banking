import { Component, OnInit, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoanStatusService } from '../../_services/loan-status.service';
import { LoanStatusList, LoanStatusResponse} from '../../_models/loan-status';
import { Subject, Observable } from 'rxjs';
import { AcctToDebit, AcctDetails } from '../../customer/_customer-model/customer.model';
import { CustomerService } from '../../customer/_customer-service/customer.service';
import swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../_services/user.service';
import { UtilitiesService } from '../../_services/utilities.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
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
  ],
  providers: [NgbTabsetConfig]
})

export class InvestmentsComponent implements OnInit, OnDestroy {

  loanStatusDetail: LoanStatusList[];
  errorMessageLoanStatus: string;
  user: any;
  nubanacct: any;
  startDate: any;
  stopDate: any;
  acctDetails: Array<AcctDetails> = [];
  public result: any;

  constructor(
    private loanStatusService: LoanStatusService,
    private customerService: CustomerService,
    private userService: UserService,
    private util: UtilitiesService
  ) {
    this.customerService.acctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(
      accts => this.acctDetails = accts
    );
   }

  ngOnInit() {
    // Set start date and end date
    const date = new Date();
    date.setDate(date.getDate() - 365);
    this.startDate = date.toISOString().split('T')[0]; // "2016-06-08"
    this.stopDate = new Date();
    this.stopDate.setDate(this.stopDate.getDate());
    this.stopDate = this.stopDate.toISOString().split('T')[0];
    console.log(this.startDate + ' - ' + this.stopDate); // delete before production

    setTimeout(() => {
      console.log(this.acctDetails[0].map_acc_no);
      const body = {
        'accountNumber': this.acctDetails[0].map_acc_no,
        'startDate': this.startDate,
        'endDate': this.stopDate
      };
      this.loanStatusService.getLoanStatus(body).pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: LoanStatusResponse) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.loanStatusDetail = res.loanStatusList;
            console.log('loanInfo ' + JSON.stringify(this.loanStatusDetail));
            this.errorMessageLoanStatus = '';
          } else {
            this.errorMessageLoanStatus = this.util.handleResponseError(res);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.errorMessageLoanStatus = JSON.stringify(err);
        },
      );
    });
}

ngOnDestroy(): void {

}

}

