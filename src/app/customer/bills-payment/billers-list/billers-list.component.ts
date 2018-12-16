import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Biller, Category } from '../_model/bills-payment.model';
import { BillsPaymentService } from '../_services/bills-payment.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { switchMap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'billers-list',
  templateUrl: './billers-list.component.html',
  styleUrls: ['./billers-list.component.scss'],
  animations: [
    trigger('slideUpDown', [
      state('in', style({height: '*'})),
      transition('* => void', [
        style({height: '*'}),
        animate('300ms ease-in', style({height: 0}))
      ]),
      transition('void => *', [
        style({height: 0}),
        animate('300ms ease-in', style({height: '*'}))
      ]),
    ])
  ]
})
export class BillersListComponent implements OnInit, OnDestroy {
  category: Category;
  billers: Biller[];
  biller: Biller;
  catFromURL: any;
  more = true;
  search = true;
  errorMessage: string;


  constructor(
    private billsPaymentService: BillsPaymentService,
    private aroute: ActivatedRoute,
    private router: Router
  ) {
    billsPaymentService.selectedCategory$.subscribe(cat => this.category = cat);
    this.billsPaymentService.billers$.subscribe(billers => this.billers = billers);
    billsPaymentService.selectedBiller$.subscribe(biller => this.biller = biller);
    billsPaymentService.billersError$.subscribe(msg => this.errorMessage = msg);
   }

   ngOnDestroy(): void {

   }

   getBillersList() {
    this.errorMessage = '';
     this.aroute.params.subscribe((params: any) => {
        console.log(params);
        this.catFromURL = params;
        this.billsPaymentService.getBillers(params.categoryId);
      });
   }

  ngOnInit() {
    console.log(this.category);
    this.getBillersList();
    this.errorMessage = '';
  }

  toggleSearch() {
    this.search = !this.search;
  }

  toggleMore() {
    this.more = !this.more;
  }

  goToProductList(biller: Biller) {
    console.log('Biller selected' + JSON.stringify(biller)); // Delete later
    this.router.navigate(['payments/biller', biller.customerName, biller.customerId]);
    this.billsPaymentService.updateSelectedBiller(biller);
    this.billsPaymentService.updateProducts(null);
  }

}
