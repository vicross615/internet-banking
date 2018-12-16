import { Component, OnInit, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger, state} from '@angular/animations';
import { Category } from '../_model/bills-payment.model';
import { BillsPaymentService } from '../_services/bills-payment.service';
import { Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
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
        animate('300ms ease-in', style({height: 0}))
      ]),
      transition('void => *', [
        style({height: 0}),
        animate('300ms ease-in', style({height: '*'}))
      ]),
    ])
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {
   // input property for transactions: accepts input of type transactionHistory[] from parent components
   public categories: Category[];
   public selectedCategory: Category;
   more = false;
   errorMessage: string;

   // this object defines the icons for each category see: [ngClass]="categoryIcons[category?.categoryName]" in template file
   public categoryIcons;

  constructor(
    private billsPaymentService: BillsPaymentService,
    private router: Router
  ) {
    billsPaymentService.selectedCategory$.subscribe(cat => this.selectedCategory = cat);
    billsPaymentService.categories$.subscribe(cats => this.categories = cats);
    billsPaymentService.categoriesError$.subscribe(msg => this.errorMessage = msg);
  }

  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.categoryIcons = this.billsPaymentService.categoryIcons;
    this.errorMessage = '';
    // this.billsPaymentService.getCategoriesData();
  }

  toggleMore() {
    this.more = !this.more;
  }

  goToBillersList(category: Category) {
    console.log('category selected' + JSON.stringify(category)); // Delete later
    this.router.navigate(['payments/category', category.categoryName, category.categoryId]);
    this.billsPaymentService.updateSelectedCategory(category);
    this.billsPaymentService.updateBillers(null);
  }

}
