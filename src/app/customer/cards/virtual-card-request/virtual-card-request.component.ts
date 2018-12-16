import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { style, transition, animate, trigger } from '@angular/animations';
import { AcctToDebit, AcctDetails } from '../../_customer-model/customer.model';
import { VirtualCard } from '../cards.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../_customer-service/customer.service';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subject ,  Observable } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, merge, filter } from 'rxjs/operators';
import { CardsService } from '../cards.service';
import { UtilitiesService } from '../../../_services/utilities.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-virtual-card-request',
  templateUrl: './virtual-card-request.component.html',
  styleUrls: ['./virtual-card-request.component.scss'],
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
export class VirtualCardRequestComponent implements OnInit, OnDestroy {
  accounts: AcctDetails[];
  virtualCard: VirtualCard;
  errorMessage: string;
  formError: string;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private cardsService: CardsService,
    private cp: CurrencyPipe,
    private util: UtilitiesService
  ) {

   }

  ngOnInit() {
    setTimeout(() => {
      this.customerService.acctDetail$
      .pipe(untilComponentDestroyed(this))
      .subscribe(accts => {
        this.accounts = accts || JSON.parse(localStorage.getItem('acctDetails'));
        if (this.accounts.length > 0) {
          this.showVirtualCard();
        } else {
          this.errorMessage = 'No Account details';
          this.loading = false;
        }
      });
    }, 5000);
  }

  ngOnDestroy(): void {

  }

  showVirtualCard() {
    this.loading = true;
    console.log('form Submitted');
    console.log(this.accounts[0].map_acc_no);
    this.cardsService.virtualCardRequest(this.accounts[0].map_acc_no)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.virtualCard = res;
          this.loading = false;
        } else {
          this.errorMessage = this.util.handleResponseError(res);
          this.loading = false;
        }
      },
      err => {
        console.log(err);
        this.errorMessage = err;
      }
    );
  }

  clearError() {
    this.errorMessage = '';
  }

}
