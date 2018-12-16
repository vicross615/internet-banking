import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  Category,
  Biller,
  Product,
  FormFields,
  CategoryIcons,
  ValidationDetails,
  Collections,
  DropDownDetails
} from '../_model/bills-payment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { UserService } from '../../../_services/user.service';
import { PaymentHistory } from '../payment-history/payment-history-cards/payment-history.model';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Injectable({ providedIn: 'root' })
export class BillsPaymentService implements OnDestroy {
  dropdownList: DropDownDetails[] = [];
  imgUrl = 'assets/icon/smashicons/bills-payment/';
  categoryIcons: CategoryIcons = {
    SchoolsProfessionalBodies: `${this.imgUrl}schools-3.svg`,
    VISAFeePayment: `${this.imgUrl}visa.svg`,
    DistributorPayments: `${this.imgUrl}distributors.svg`,
    Others: `${this.imgUrl}more.svg`,
    InsuranceHealthPlan: `${this.imgUrl}insurance.svg`,
    AirtimeData: `${this.imgUrl}airtime-data.svg`,
    ReligiousDonations: `${this.imgUrl}religious-donations.svg`,
    ShippingLinePayment: `${this.imgUrl}shipping.svg`,
    CapitalMarketInvestments: `${this.imgUrl}investments.svg`,
    ElectricityWater: `${this.imgUrl}electricity-2.svg`,
    GovernmentTaxesandLevies: `${this.imgUrl}tax.svg`,
    TravelsTransportation: `${this.imgUrl}travel.svg`,
    EventsandTicketing: `${this.imgUrl}events-2.svg`,
    FinancialInstitutions: `${this.imgUrl}bank.svg`,
    SportsandGaming: `${this.imgUrl}sports-games.svg`,
    CableTV: `${this.imgUrl}tv-subscription.svg`,
    TollFeesLCC: `${this.imgUrl}tv-subscription.svg`,
    Remita: `${this.imgUrl}tv-subscription.svg`,
    HotelsEstatesAssociations: `${this.imgUrl}hotels.svg`
    // tslint:disable-next-line:semicolon
  };
  private Payments_URL = environment.BASE_URL + environment.PAYMENTS_SERV;
  private Req_URL = environment.BASE_URL + environment.REQ_SERV;
  // Observable string sources: Categories
  private categoriesSource = new BehaviorSubject<Category[]>(null);
  private selectedCategorySource = new BehaviorSubject<Category>(null);
  private categoriesErrorSource = new BehaviorSubject<string>(null);

  // Observable string streams: Categories
  categories$ = this.categoriesSource.asObservable();
  selectedCategory$ = this.selectedCategorySource.asObservable();
  categoriesError$ = this.categoriesErrorSource.asObservable();

  // Observable string sources: Billers
  private billersSource = new BehaviorSubject<Biller[]>(null);
  private selectedBillerSource = new BehaviorSubject<Biller>(null);
  private billersErrorSource = new BehaviorSubject<string>(null);

  // Observable string streams: Billers
  billers$ = this.billersSource.asObservable();
  selectedBiller$ = this.selectedBillerSource.asObservable();
  billersError$ = this.billersErrorSource.asObservable();

  // Observable string sources: products
  private productsSource = new BehaviorSubject<Product[]>(null);
  private selectedProductSource = new BehaviorSubject<Product>(null);
  private productsErrorSource = new BehaviorSubject<string>(null);

  // Observable string streams: products
  products$ = this.productsSource.asObservable();
  selectedproduct$ = this.selectedProductSource.asObservable();
  productsError$ = this.productsErrorSource.asObservable();

  // Observable string sources: formFields
  private formFieldsSource = new BehaviorSubject<FormFields[]>(null);
  private selectedFormFieldSource = new BehaviorSubject<FormFields>(null);
  private formFieldsErrorSource = new BehaviorSubject<string>(null);

  // Observable string streams: formfields
  formFields$ = this.formFieldsSource.asObservable();
  selectedFormField$ = this.selectedFormFieldSource.asObservable();
  formFIeldsError$ = this.formFieldsErrorSource.asObservable();

  // Observable: Frequent Bills
  private freqBillsSource = new Subject<any[]>();
  freqBills$ = this.freqBillsSource.asObservable();
  private freqBillsErrorSource = new Subject<string>();
  freqBillsError$ = this.freqBillsErrorSource.asObservable();

  // Observable: Payment History
  private paymentHistorySource = new Subject<PaymentHistory[]>();
  paymentHistory$ = this.paymentHistorySource.asObservable();
  private paymentHistoryErrorSource = new Subject<string>();
  paymentHistoryError$ = this.paymentHistoryErrorSource.asObservable();

  // Observable: Validation
  private validationDetailsSource = new Subject<ValidationDetails>();
  validationDetails$ = this.validationDetailsSource.asObservable();
  private validationDetailsErrorSource = new BehaviorSubject<string>(null);
  validationDetailsError$ = this.validationDetailsErrorSource.asObservable();

    // Observable: Collections
    private collectionsSource = new BehaviorSubject<Collections[]>(null);
    private selectedCollectionSource = new BehaviorSubject<Collections>(null);
    private collectionsErrorSource = new BehaviorSubject<string>(null);
    collections$ = this.collectionsSource.asObservable();
    selectedCollection$ = this.selectedCollectionSource.asObservable();
    collectionsError$ = this.collectionsErrorSource.asObservable();

  // this object defines the icons for each category see: [ngClass]="categoryIcons[category?.categoryName]" in template file

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router,
  ) { }

  ngOnDestroy(): void {

  }

  // ====================================================================
  // ======================== PRODUCT SEARCH ============================
  // ====================================================================

  getCollections(): Observable<any> {
    const PATH = this.Req_URL + `/GetCollectionForm`; //Encryption Added by Sunky 
    let body: any = {};
    body = this.util.addAuthParams(body);
    delete body.sessionId;
    delete body.channel;
    delete body.customerId;
    delete body.customerNumber;
    body.requestId = this.util.extEncrypt(body.requestId);
    body.userId = this.util.extEncrypt(body.userId);
    console.log(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getCollectionsData() {
    this.getCollections().subscribe(
        res => {
          console.log(res);
          if (res.responseCode === '00') {
            this.updateCollections(res.collections);
            this.updateCollectionsError(null);
          } else {
            this.updateCollectionsError(this.util.handleResponseError(res));
            this.updateCollections(null);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateCollectionsError(err);
          this.updateCollections(null);
        }
      );
  }

  updateCollections(collections) {
    this.collectionsSource.next(collections);
  }

  updateSelectedCollection(selectedCollection) {
    this.selectedCollectionSource.next(selectedCollection);
  }

  updateCollectionsError(message) {
    this.collectionsErrorSource.next(message);
  }

  // =========================== CATEGORIES ===============================

  getCategories(): Observable<any> {
    const PATH = this.Payments_URL + `/GetCategories`;
    let body: any = {};
    body = this.util.addAuthParams(body);
    body.userId = this.util.extEncrypt(body.userId);
    body.sessionId = this.util.extEncrypt(body.sessionId);
    body.requestId = this.util.extEncrypt(body.requestId);
    console.log(body);
    console.log(JSON.stringify(body))
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getCategoriesData() {
    this.getCategories().pipe(untilComponentDestroyed(this))
      .subscribe(
        res => {
          if (res.responseCode === '00') {
            res.catDetails.forEach((category: Category) => {
              category.categoryIconName = category.categoryName.replace(/&|\s|-|,/g, '').trim();
              console.log(category);
            });
            this.updateCategories(res.catDetails);
          } else {
            this.updateCategoriesError(this.util.handleResponseError(res));
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateCategoriesError(err);
        }
      );
  }

  updateCategories(categories) {
    this.categoriesSource.next(categories);
  }

  updateSelectedCategory(selectedCategory) {
    this.selectedCategorySource.next(selectedCategory);
  }

  updateCategoriesError(message) {
    this.categoriesErrorSource.next(message);
  }

  // =========================== BILLERS ==============================

  getBillersByCategoryId(categoryId: string): Observable<any> {
    const PATH = this.Payments_URL + `/GetCustomersByCategoryId`;
    let body: any = { };
    body.categoryId = categoryId;
    body.isCustomerLogo = true;
    body = this.util.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getBillers(categoryId) {
    // tslint:disable-next-line:quotemark
    this.updateBillersError('');
    this.getBillersByCategoryId(categoryId).pipe(untilComponentDestroyed(this))
      .subscribe(
        res => {
          if (res.responseCode === '00') {
            console.log('Billers: ' + JSON.stringify(res.custDetails)); // Delete later
            for (const h of res.custDetails) {
              if (!h.customerLogo) {
                h.image = 'assets/icon/smashicons/bills-payment/billers2.svg';
              } else {
                h.image = `data:image/${h.imageType};base64,${h.customerLogo}`;
              }
              console.log(res.cusDetails);
            }
            this.updateBillers(res.custDetails);
            // console.log('Selected Biller ID: ' + JSON.stringify(billers.custDetails[0].customerId));
          } else {
            this.updateBillersError(this.util.handleResponseError(res));
            // alert('An Error Occured' + billers.responseDescription);
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateBillersError(err);
        }
      );
  }

  updateBillers(billers) {
    this.billersSource.next(billers);
  }

  updateSelectedBiller(selectedBiller) {
    this.selectedBillerSource.next(selectedBiller);
  }

  updateBillersError(message) {
    this.billersErrorSource.next(message);
    console.log(message);
  }

  // ======================= PRODUCTS ========================

  getProductsByCustomerId(customerId: string): Observable<any> {
    const PATH = this.Payments_URL + `/GetFormsByCustomerId`;
    let body: any = {};
    body = this.util.addAuthParams(body);
    body.customerId = customerId;
    delete body.customerNumber;
    body.userId = this.util.extEncrypt(body.userId);
    body.sessionId = this.util.extEncrypt(body.sessionId);
    body.requestId = this.util.extEncrypt(body.requestId);
    console.log(body); // for debugging only
    this.updateFormFields(null);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getProducts(customerId) {
    this.updateProductsError('');
    this.getProductsByCustomerId(customerId).subscribe(
      res => {
        console.log(res);
        if (res.responseCode === '00') {
          this.updateProducts(res.formDetails);
          this.updateSelectedProduct(res.formDetails[0]);
          // ====================================================
          // add condition to check if product search item exist then use its ID to get formFIields
          // ======================================================
          this.getFormFields(res.formDetails[0].formId);
        } else {
          this.updateProductsError(this.util.handleResponseError(res));
          // alert('An Error Occured' + billers.responseDescription);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateProductsError(err);
      }
    );
  }

  updateProducts(products) {
    this.productsSource.next(products);
  }

  updateSelectedProduct(selectedProduct) {
    this.selectedProductSource.next(selectedProduct);
  }

  updateProductsError(message) {
    this.productsErrorSource.next(message);
    console.log(message);
  }

  // ======================= FORMS ========================
  getFormFieldsByFormId(formId: string): Observable<any> {
    const PATH = this.Payments_URL + `/GetFormFieldsByFormId`;
    let body = { formId: formId };
    body = this.util.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getFormFields(formId) {
    this.updateFormFieldsError(null);
    this.updateProductsError(null);
    this.getFormFieldsByFormId(formId).pipe(untilComponentDestroyed(this))
      .subscribe(
        res => {
          console.log(res);
          if (res.responseCode === '00') {
            this.updateProductsError('');
            this.addFieldTypeString(res.formFields);
            this.addDropdownDetails(res.formFields);
            this.updateFormFields(res.formFields);
          } else {
            this.updateFormFields(null);
            this.updateFormFieldsError(this.util.handleResponseError(res));
            this.updateProductsError(this.util.handleResponseError(res));
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateFormFieldsError(err);
          this.updateProductsError(err);
        }
      );
  }

  addFieldTypeString(formFieldArray: FormFields[]) {
    for (const h of formFieldArray) {
      switch (h.field_type) {
        case 1: h.field_type_string = 'select'; break;
        case 2: h.field_type_string = 'text'; break;
        case 3: h.field_type_string = 'date'; break;
        case 4: h.field_type_string = 'select'; break;
        case 5: h.field_type_string = 'checkbox'; break;
        case 6: h.field_type_string = 'checkbox'; break;
        default: break;
      }
      // h.dataSource = 1;
    }
    console.log(formFieldArray);
  }

  // ================== METHOD TO ADD DROPDOWN DETAILS =====================

  addDropdownDetails(formFieldArray: FormFields[]) {
    for (const h of formFieldArray) {
      if (h.field_type === 1 || h.field_type === 4) {
        this.getDropdownList(h.field_lov).subscribe(
          (res: any) => {
            console.log(res);
            if (res.responseCode === '00') {
              this.updateProductsError('');
              h.dropdown_Details = res.dropDownDetails;
              console.log(h.dropdown_Details);
            } else {
              h.dropdown_Details = null;
              this.updateProductsError(this.util.handleResponseError(res).replace('.', '') + ' for ' + h.field_name);
            }
          },
          (err: HttpErrorResponse) => {
            h.dropdown_Details = null;
            console.log(err);
            this.updateProductsError(err);
          }
        );
      } else {
        h.dropdown_Details = null;
      }
    }
    console.log(formFieldArray);
  }

  // ======================= DROPDOWN DETAILS ========================
  getDropdownList(lovId: number): Observable<any> {
    const PATH = this.Payments_URL + `/GetDropDownDetails`;
    let body = { lovId: lovId };
    body = this.util.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }


  getDropdownListData(lovId: number) {
    let list: any = [];
    this.getDropdownList(lovId).subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.updateProductsError('');
          this.dropdownList = res.dropDownDetails;
          list = this.dropdownList;
          console.log(this.dropdownList);
          console.log(list);
        } else {
          list = this.dropdownList;
          console.log(this.dropdownList);
          console.log(list);
          this.updateProductsError(this.util.handleResponseError(res));
        }
      },
      (err: HttpErrorResponse) => {
        this.dropdownList = null;
        console.log(err);
        this.updateProductsError(this.util.handleResponseError(err));
      }
    );
    console.log(list);
    return list;

  }

  // ================================================================

  updateFormFields(formFields) {
    this.formFieldsSource.next(formFields);
    console.log(formFields);
  }

  updateSelectedFormField(selectedFormField) {
    this.selectedFormFieldSource.next(selectedFormField);
  }

  updateFormFieldsError(message) {
    this.formFieldsErrorSource.next(message);
    console.log(message);
  }

  // ======================= Frequent Bills ========================
  get frequentBills(): Observable<any> {
    const PATH = this.Payments_URL + `/GetFrequentBills`;
    let body: any = {
      count: '10',
      days: '30',
    };
    body = this.util.addAuthParams(body);
    delete body.customerID;
    delete body.customerNumber;
    body.userId = this.util.extEncrypt(body.userId);
    body.sessionId = this.util.extEncrypt(body.sessionId);
    body.requestId = this.util.extEncrypt(body.requestId);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }
  // Initialize the Observable with Data
  getfrequentBillsData() {
    this.frequentBills.pipe(untilComponentDestroyed(this))
      .subscribe(
        res => {
          console.log(res);
          if (res.responseCode === '00') {
            this.freqBillsSource.next(res.freqBillsDetails);
            this.freqBillsErrorSource.next(null);
          } else {
            this.freqBillsErrorSource.next(this.util.handleResponseError(res));
          }
        },
        (err: any) => {
          console.log(err);
          this.freqBillsErrorSource.next(err);
        }
      );
  }

  // ======================= Payment History ========================
  get paymentHistory(): Observable<any> {
    const PATH = this.Payments_URL + `/GetBillsHistory`;
    let body: any = {};
    body = this.util.addAuthParams(body);
    body.channel = 'ivr';
    delete body.customerID; delete body.customerNumber;
    body.userId = this.util.extEncrypt(body.userId);
    body.sessionId = this.util.extEncrypt(body.sessionId);
    body.requestId = this.util.extEncrypt(body.requestId);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }
  // Initialize the Observable with Data
  getPaymentHistoryData() {
    this.paymentHistory.pipe(untilComponentDestroyed(this))
      .subscribe(
        res => {
          console.log(res);
          if (res.responseCode === '00') {
            this.paymentHistorySource.next(res.billHistoryDetails);
            this.paymentHistoryErrorSource.next(null);
          } else {
            this.paymentHistoryErrorSource.next(this.util.handleResponseError(res));
          }
        },
        (err: any) => {
          console.log(err);
          this.paymentHistoryErrorSource.next(err);
        }
      );
  }

  // ========================= BILLS PAYMENT VALIDATION =====================
  getValidationDetails(body): Observable<any> {
    const PATH = this.Payments_URL + `/ValidateFieldDetails`;
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getValidationDetailsData(body) {
    this.updateValidationDetailsError(null);
    this.getValidationDetails(body).subscribe(
        (res: any) => {
          console.log(res); // Delete
          if (res.responseCode === '00') {
            const validationDetails: ValidationDetails = { };
            validationDetails.accountToCredit = res.accountToCredit;
            validationDetails.customLovContent = res.customLovContent;
            validationDetails.formCharges = res.formCharges;
            validationDetails.formChargeSplit = res.formChargeSplit;
            validationDetails.formFieldsDetails = res.formFieldsDetails;
            validationDetails.validationRef = res.validationRef;
            validationDetails.validationResponse = res.validationResponse;
            this.updateValidationDetails(validationDetails);
            console.log(validationDetails);
          } else {
            this.updateValidationDetails(null);
            this.updateValidationDetailsError(this.util.handleResponseError(res));
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateValidationDetailsError(err);
        }
      );
  }

  updateValidationDetails(details) {
    this.validationDetailsSource.next(details);
  }

  updateValidationDetailsError(message) {
    this.validationDetailsErrorSource.next(message);
    console.log(message);
  }

  // ========================= BILLS PAYMENT POSTING =====================
  postingCollection(body): Observable<any> {
    const PATH = this.Payments_URL + `/PostCollectionData`;
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

}
