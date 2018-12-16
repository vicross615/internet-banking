import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {animate, style, transition, trigger, state} from '@angular/animations';
import { Category, Product, FormFields, Collections } from './_model/bills-payment.model';
import { UtilitiesService } from '../../_services/utilities.service';
import { BillsPaymentService } from './_services/bills-payment.service';
import { FormControl } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-bills-payment',
  templateUrl: './bills-payment.component.html',
  styleUrls: ['./bills-payment.component.scss'],
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
export class BillsPaymentComponent implements OnInit, OnDestroy {
  public searchModel: Collections;
  public productSearchObject: Array<Collections> = [];
  collectionError: string;
  searchInput = new FormControl('');
  public selectedCategory: Category;
  public isCategoriesCollapsed: boolean;
  public selectedBiller: string;
  public selectedForm: string;
  config: any;
  @ViewChild('searchInstance') searchInstance: NgbTypeahead;
  searchFocus$ = new Subject<string>();
  searchClick$ = new Subject<string>();


  constructor(
    private billsPaymentService: BillsPaymentService,
    private aroute: ActivatedRoute,
    private router: Router
  ) {
    this.billsPaymentService.getCategoriesData();
    this.billsPaymentService.getCollectionsData();
    this.billsPaymentService.collections$.subscribe(c => this.productSearchObject = c);
    this.billsPaymentService.collectionsError$.subscribe(err => this.collectionError = err);
   }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }

  /*==========================================
    PRODUCT PAYMENT SEARCH TYPEAHEAD
  ============================================*/
  productSearchTypeahead = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.searchClick$.pipe(filter(() => !this.searchInstance.isPopupOpen()));
    const inputFocus$ = this.searchFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.productSearchObject
      : this.productSearchObject.filter(v => v.formTitle.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 5))
  );
  }

  formatter = (x: {formTitle: string}) => x.formTitle;

  clear() {
    this.searchInput.setValue('');
    this.searchModel = null;
  }

  onAcctChange() {
    console.log();
    setTimeout(() => {
      console.log(JSON.stringify(this.searchModel));
      this.goToProductList(this.searchModel);
    }, 200);
  }

  goToProductList(searchObj: Collections) {
    this.router.navigate(['payments/biller', searchObj.customerName, searchObj.customerId]);
    // this.billsPaymentService.updateSelectedBiller(searchObj);
    this.billsPaymentService.updateSelectedCollection(searchObj);
    this.billsPaymentService.updateProducts(null);
  }

  /*==========================================
    END OF CATEGORY METHODS
  ============================================*/

}

// MODEL




