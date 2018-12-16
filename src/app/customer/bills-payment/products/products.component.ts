import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Category, Biller, Product, FormFields, Collections } from '../_model/bills-payment.model';
import { BillsPaymentService } from '../_services/bills-payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
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
    ]),
    trigger('slideUpDown', [
      state('in', style({ height: '*' })),
      transition('* => void', [
        style({ height: '*' }),
        animate('300ms ease-in', style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate('300ms ease-in', style({ height: '*' }))
      ]),
    ])
  ]
})
export class ProductsComponent implements OnInit, OnDestroy {
  category: Category;
  biller: Biller;
  billerFromURL: any;
  products: Product[];
  product: Product;
  formFields: FormFields[];
  isLoading = false;
  errorMessage: string;
  more = false;
  billerName: any;

  constructor(
    private location: Location,
    private billsPaymentService: BillsPaymentService,
    private aroute: ActivatedRoute,
    private router: Router
  ) {
    this.billsPaymentService.selectedCategory$.subscribe(cat => this.category = cat);
    this.billsPaymentService.selectedBiller$.subscribe(biller => this.biller = biller);
    this.billsPaymentService.products$.subscribe(prods => this.products = prods);
    this.billsPaymentService.selectedproduct$.subscribe(prod => this.product = prod);
    billsPaymentService.productsError$.subscribe(message => this.errorMessage = message);
    this.billsPaymentService.formFields$.subscribe( formFields => this.formFields = formFields);
  }

  ngOnDestroy(): void {

  }

  getProducts() {
    this.errorMessage = '';
    this.billsPaymentService.updateSelectedProduct(null);
    this.aroute.params
      .subscribe(
        (params: any) => {
          console.log(params);
          this.billerFromURL = params;
          this.billsPaymentService.getProducts(params.billerId);
        }
      );
  }

  ngOnInit() {
    console.log(this.biller);
    this.getProducts();
    this.billsPaymentService.selectedCollection$.subscribe((c: Collections) => {
      if (c) {
        console.log(c);
        this.billsPaymentService.getFormFields(c.formId);
      }
    });
  }

  toggleMore() {
    this.more = !this.more;
  }

  changeProduct(product) {
    const productObj: Product = JSON.parse(product);
    console.log('New Product selected: ' + JSON.stringify(productObj.formTitle));
    this.billsPaymentService.updateSelectedProduct(productObj);
    this.billsPaymentService.getFormFields(productObj.formId);
  }

  back() {
    this.location.back();
  }

}
