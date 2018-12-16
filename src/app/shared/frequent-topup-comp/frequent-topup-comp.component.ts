import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { AirtimeDataService } from '../../customer/topup/airtime-data.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
@Component({
  selector: 'app-gtibank-frequent-topup-comp',
  templateUrl: './frequent-topup-comp.component.html',
  styleUrls: ['./frequent-topup-comp.component.scss'],
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
export class FrequentTopupCompComponent implements OnInit, OnDestroy {
  recentTransfers: Array<RecentTransfers> = [];
  requestTypeIs = 0; // Defaults to Airtime Purchase, 1 for Data Purchase
  @Output()
  toggleEvent = new EventEmitter();

  constructor(
    private airtime_DataService: AirtimeDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRecentTransfers();
  }
  ngOnDestroy(): void {}
  // Return the Recent Transfers
  public async getRecentTransfers() {
    console.log(this.recentTransfers);
    this.airtime_DataService.recentTransferObservable.subscribe((data: any) => {
      console.log(data);
      if (data.length === 0) {
        this.recentTransfers = [];
        console.log(this.recentTransfers);
      } else {
        for (let i = 0; i < data.length; i++) {
          const stream: RecentTransfers = {
            amount: data[i].AMOUNT,
            number: data[i].CusMobileNumber,
            type: data[i].Type,
            producttype: data[i].UtilityType,
            paymenttype: data[i].PaymentType,
            count: data[i].COUNT
          };
          this.recentTransfers.push(stream);
          console.log(this.recentTransfers);
        }
      }
    });
  }
  // To Dynamically display logo
  detectProductType(product: any, hint): Boolean {
    const stateY = product.includes(hint);
    return stateY;
  }
  // form toggle.
  set requestType(value: number) {
    this.requestTypeIs = value;
    this.toggleEvent.emit(value);
    this.airtime_DataService.toggle(value);
  }
  // Repopulate form
  routeToForm(i) {
    // Pass value to service
    this.airtime_DataService.storeValuesToObserble = i;
    // Note the currently selected service and store the value
    this.airtime_DataService.activeAirtimeName = i.producttype;
    console.log(i);
    // Then route to selected service
    if (i.producttype.includes('MTN')) {
      this.router.navigate(['/topup/mtn']);
      return;
    }
    if (i.producttype.includes('AIRTEL')) {
      this.router.navigate(['/topup/airtel']);
      return;
    }
    if (i.producttype.includes('9MOBILE')) {
      this.router.navigate(['/topup/nine-mobile']);
      return;
    }
    if (i.producttype.includes('GLOBACOM')) {
      this.router.navigate(['/topup/globacom']);
      return;
    }
    if (i.producttype.includes('GLO')) {
      this.router.navigate(['/topup/globacom']);
      return;
    }
  }
  goToTransfers() {
    this.router.navigate(['topup']);
  }
}
export interface RecentTransfers {
  amount: any;
  number: any;
  type: any;
  producttype: any;
  paymenttype: any;
  count: any;
}
