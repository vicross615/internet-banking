import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransferService } from '../_services/transfer.service';
import { FreqBeneficiaries, FreqBeneficiariesResponse } from '../../_customer-model/customer.model';
import { UtilitiesService } from '../../../_services/utilities.service';
import { Router } from '@angular/router';
import { transition, trigger, animate, style, state } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'frequent-transfers',
  templateUrl: './frequent-transfers.component.html',
  styleUrls: ['./frequent-transfers.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('500ms ease-in-out', style({opacity: 0}))
      ])
    ]),
    trigger('slideUpDown', [
      state('in', style({height: '*'})),
      transition('* => void', [
        style({height: '*'}),
        animate('300ms', style({height: 0}))
      ]),
      transition('void => *', [
        style({height: 0}),
        animate('300ms', style({height: '*'}))
      ]),
    ])
  ],
})
export class FrequentTransfersComponent implements OnInit, OnDestroy {
  public freqBeneficiaries: Array<FreqBeneficiaries>;
  loading = true;
  errorMessage: any;
  transferType = 2;

  constructor(
    private transferService: TransferService,
    private util: UtilitiesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.transferType = 2;
    this.returnFreqBeneficiary(2);
  }

  ngOnDestroy(): void {

  }

  resetList(transType) {
    this.loading = true;
    this.freqBeneficiaries = null;
    this.transferType = transType;
    this.returnFreqBeneficiary(transType);
  }

  returnFreqBeneficiary(type) {
     this.errorMessage = '';
    this.transferService.getFreqBeneficiaries(type)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: FreqBeneficiariesResponse) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.loading = false;
            this.errorMessage = null;
            this.freqBeneficiaries = res.mostFreq;
          } else {
            this.freqBeneficiaries = null;
            this.errorMessage = this.util.handleResponseError(res);
            this.loading = false;
            // alert('Freq Beneficiaries: ' + res.responseDescription + '. You are viewing ofline data');
          }
      },
     (err: HttpErrorResponse) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = err;
      }
    );
  }

  repeatTransfer(beneficiary: FreqBeneficiaries) {
    this.transferService.updateSelectedFreqBeneficiary(beneficiary);
    console.log('Bank is: ' + beneficiary.bankName);
    this.router.navigate(['transfers/quick-transfer']);
    console.log('Freq Beneficiary: ' + this.transferService.selectedfreqBeneficiary$);
  }

  goToTransfers() {
    this.router.navigate(['transfers']);
  }

}
