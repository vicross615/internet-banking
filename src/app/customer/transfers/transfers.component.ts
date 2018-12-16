import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { CustomerService } from '../_customer-service/customer.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import {
    Beneficiaries,
    BeneficiariesResponse,
    PreRegBeneficiariesResponse,
    PreRegBeneficiaries
  } from '../_customer-model/customer.model';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: [
    './transfers.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
    ])
  ],
})
export class TransfersComponent implements OnInit, OnDestroy {
  more = false;
  constructor(
    private customerService: CustomerService
  ) {
    this.customerService.getPreRegBeneficiariesData();
    this.customerService.getBeneficiariesData('GTBankThirdParty');
    this.customerService.getBanksData();
   }

  ngOnInit() {
    this.customerService.preRegBeneficiaries$.subscribe();
    this.customerService.beneficiaries$.subscribe();
    this.customerService.banks$.subscribe();
  }

  ngOnDestroy(): void {

  }

  toggleMenu() {
    this.more = !this.more;
  }

}
