import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, formatDate, DatePipe } from '@angular/common';
import {
  AcctToDebitFX,
  AcctToDebit,
  Country, Purpose,
  Beneficiaries, FundsSource, BizNature, RelFxTrans,
  Beneficiary, FxDropdownResponse, FxBeneficiaries, FxBeneficiaryDetails
} from '../../_customer-model/customer.model';
import { Modal } from '../../transfers/transfer-message-modal/modal.model';
import { Subject, Observable, merge } from 'rxjs';
import { CustomerService } from '../../_customer-service/customer.service';
import { UtilitiesService } from '../../../_services/utilities.service';
import { TransferService } from '../../transfers/_services/transfer.service';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { FxService } from '../fx.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-other-bank-fx',
  templateUrl: './other-bank-fx.component.html',
  styleUrls: ['./other-bank-fx.component.scss',
    '../../../../assets/icon/icofont/css/icofont.css',
    '../../../../../node_modules/sweetalert2/src/sweetalert2.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  // Animation
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
})
export class OtherBankFxComponent implements OnInit, OnDestroy {

  public currencySymbol = {'NGN': '₦', 'USD': '$', 'GBP': '£', 'EUR': '€', };
  today = new Date();
  public gtFXTransferForm: FormGroup;
  public acctToDebitFX: AcctToDebitFX = null;
  acctToDebitFXModel: AcctToDebitFX;
  public acctToDebit: Array<AcctToDebit> = [];
  acctToDebitModel: AcctToDebit;
  modal: Modal = new Modal();
  currencies: Array<any>;
  countries: Country[];
  paymentpurpose: Purpose;
  fxBenDetails: FxBeneficiaryDetails;
  selectedCurrency: any;
  public savedFXBeneficiaries: Array<FxBeneficiaries> = [];
  // public savedFXBeneficiary: FxBeneficiaries;
  savedFXBeneficiariesModel: string;
  FXbeneficiaryLabel = 'Enter Beneficiary`s name';
  transferLimit = 0.00;
  successMessage = '';
  errorMessage = '';
  public newBeneficiaryDetail: any;
  public selectedSavedBeneficiaryDetail: FxBeneficiaries;
  isLoading: boolean;
  loadingBeneficiary: boolean;
  public fundSource: FundsSource;
  public biznature: BizNature;
  public benBiznature: BizNature;
  public relationship: RelFxTrans;
  FxfundSourceModel: string;
  FxbizNatureModel: string;
  FXRelationshipModel: string;
  countries_Instance_Model: string;
  FxpaymentpurposeModel: string;
  public formSubmit = false;
  public reqBody: Object;
  public fxPayBody: Array<any>;
  declarationStatus = false;
  CBNRegStatus = false;
  similarTransStatus: string;
  thirdpartyStatus: string;
  bankInCanadaStatus: string;
  fxBenSenderRelationship: string;
  fxpaymentPurpose: string;
  fxFundSource: string;
  fxBiznature: string;
  fxBenBiznature: string;
  formatedDate: any;
  public acctModel: any;
  // svalue: any;


  @ViewChild('acctToDebitFXInstance') acctToDebitFXInstance: NgbTypeahead;
  @ViewChild('savedFXBeneficiariesInstance') savedFXBeneficiariesInstance: NgbTypeahead;
  @ViewChild('chargeAcctInstance') chargeAcctInstance: NgbTypeahead;
  @ViewChild('fundSourceInstance') fundSourceInstance: NgbTypeahead;
  @ViewChild('bizNatureInstance') bizNatureInstance: NgbTypeahead;
  @ViewChild('relationshipInstance') relationshipInstance: NgbTypeahead;
  @ViewChild('nationalityInstance') nationalityInstance: NgbTypeahead;
  @ViewChild('fxpaymentpurposeInstance') fxpaymentpurposeInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  chargAcctFocus$ = new Subject<string>();
  chargAcctClick$ = new Subject<string>();
  focusbz$ = new Subject<string>();
  clickbz$ = new Subject<string>();
  focusR$ = new Subject<string>();
  clickR$ = new Subject<string>();
  countryfocus$ = new Subject<string>();
  countryclick$ = new Subject<string>();
  private checkInput;


  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    public util: UtilitiesService,
    private cp: CurrencyPipe,
    private modalService: NgbModal,
    private dp: DatePipe,
    private fxService: FxService,
  ) {
    this.currencies = [
      {
        id: '2',
        desc: 'USD',
        name: 'US DOLLAR'
      },
      {
        id: '3',
        desc: 'GBP',
        name: 'POUNDS'
      },
      {
        id: '46',
        desc: 'EUR',
        name: 'EURO'
      },
      {
        id: '14',
        desc: 'CAD',
        name: 'DOLLAR(CAD)'
      },
      // {
      //   id: '7',
      //   desc: 'YEN'
      // },
      // {
      //   id: '43',
      //   desc: 'RAND'
      // },
    ];
    this.selectedCurrency = this.currencies[0];

    this.customerService.getFxBeneficiariesData();
    this.customerService.fxbeneficiaries$
    .subscribe(

      (fxbeneficiaries) => {
        console.log(fxbeneficiaries);
        this.savedFXBeneficiaries = fxbeneficiaries;
        console.log(this.savedFXBeneficiaries);
      }
    );

    this.formatedDate = dp.transform(this.today, 'shortDate', 'en-US');
    this.formatedDate = formatDate(this.formatedDate, 'yyyy-MM-dd', 'en-US');
    console.log(this.today);
    console.log(this.formatedDate);

    this.util.form_utilities('/GetCountries2').subscribe((res: any) => {
      this.countries = res.countryInfoDetails;
    });

    // this.customerService.GetCountries2().subscribe(
    //     (res: any) => {
    //       this.countries = res.countryInfoDetails;
    //     });

        this.customerService.GetPurpose().pipe(untilComponentDestroyed(this))
        .subscribe(
          (res: any) => {
            this.paymentpurpose = res.fxpurp;
          });

    this.customerService.GetFXdropdowns().pipe(untilComponentDestroyed(this))
    .subscribe(
        (res: any) => {
          this.fundSource = res.fundsSource;
          this.biznature = res.bizNature;
          this.benBiznature = res.bizNature;
          this.relationship = res.rel_FxTrans;
        });
  }

  FXacctToDebitEventHander($event: any) {
    this.acctToDebitFX = $event;
    console.log('parent: ' + JSON.stringify(this.acctToDebitFX));
    // this.compareAccts();
    this.gtFXTransferForm.controls['acctToDebitFX'].patchValue($event);
  }

  AllAcctEventHander($event: any) {
    this.acctToDebit = $event;
    console.log('parent Account to Debit for Charge: ' + JSON.stringify(this.acctToDebit));
    // this.compareAccts();
    this.gtFXTransferForm.controls['acctToDebit'].patchValue($event);
  }

  // // Benbiznature
  // async relationshipEventHander($event: any) {
  //   const code = $event.code;
  //   // this.states(code);
  //   this.gtFXTransferForm.controls['relationship'].patchValue($event);
  // }

  optionSelected(option) {
    this.selectedCurrency = option;
    this.fxacctTodebitForcharge(this.selectedCurrency.id);
  }

  changeLabel(label: string) {
    this.customerService.getFxBeneficiariesData();
    this.FXbeneficiaryLabel = label;
    setTimeout(() => {
      console.log(this.gtFXTransferForm.value.beneficiaryOption);
    }, 2000);
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createGtTransferForm();
    }
  }

  checkSimilarTrans() {
    this.gtFXTransferForm.value.SimilarTrans === true
      ? (this.similarTransStatus = 'YES')
      : (this.similarTransStatus = 'NO');
  }

  check3rdparty() {
    this.gtFXTransferForm.value.thirdparty === true
      ? (this.thirdpartyStatus = 'YES')
      : (this.thirdpartyStatus = 'NO');
  }

  checkIsBenBankInCanada() {
    this.gtFXTransferForm.value.isBenBankInCanada === true
      ? (this.bankInCanadaStatus = 'YES')
      : (this.bankInCanadaStatus = 'NO');
  }

  fxacctTodebitForcharge(curCode) {
    this.fxService.acctTodebitForChargeFX(curCode).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        this.acctToDebit = res.acct;
        console.log(res.acct);
      });
  }

  GetFxBeneficiaryDetails(value) {
    console.log(value.sNo);
    this.customerService.GetBeneficiaryDetails(value.sNo).toPromise()
      .then(
        (res: any) => {
          this.fxBenDetails = res;
          console.log(this.fxBenDetails);
          this.gtFXTransferForm.controls['BeneName'].setValue(this.fxBenDetails.benName);
          this.gtFXTransferForm.controls['BeneAddress'].setValue(this.fxBenDetails.benAddress);
          this.gtFXTransferForm.controls['countries'].setValue(this.fxBenDetails.beneCountryCode);
          this.gtFXTransferForm.controls['BenSwiftCode'].setValue(this.fxBenDetails.benBICSwiftCode);
          this.gtFXTransferForm.controls['BenSortCode'].setValue(this.fxBenDetails.sortCode);
          this.gtFXTransferForm.controls['BenBankAcctNoIBAN'].setValue(this.fxBenDetails.benBankAcctIBAN);
          this.gtFXTransferForm.controls['BenBankname'].setValue(this.fxBenDetails.benBankName);
          this.gtFXTransferForm.controls['BenBankAddress'].setValue(this.fxBenDetails.benBankAddress);
          if (!isNullOrUndefined(this.fxBenDetails.intBankName) && this.fxBenDetails.intBankName !== '') {
            console.log(this.fxBenDetails.intBankName);
            this.gtFXTransferForm.controls['isInterbankRequired'].setValue('YES');
            this.gtFXTransferForm.controls['InterBankName'].setValue(this.fxBenDetails.intBankName);
            this.gtFXTransferForm.controls['InterBankAddress'].setValue(this.fxBenDetails.intBankAddress);
            this.gtFXTransferForm.controls['InterBankSwiftCode'].setValue(this.fxBenDetails.intBenBICSwiftCode);
            this.gtFXTransferForm.controls['InterBankSortCode'].setValue(this.fxBenDetails.intSortcode);
            this.gtFXTransferForm.controls['InterBenBankAcct'].setValue(this.fxBenDetails.intBankAcctNo);
          } else {
            this.gtFXTransferForm.controls['isInterbankRequired'].setValue('NO');
          }
          if (!isNullOrUndefined(this.fxBenDetails.canadaTransitNo) && this.fxBenDetails.canadaTransitNo !== '') {
            this.gtFXTransferForm.controls['isBenBankInCanada'].setValue('YES');
            this.gtFXTransferForm.controls['TransitNo'].setValue(this.fxBenDetails.canadaTransitNo);
            this.gtFXTransferForm.controls['InstitutionNumber'].setValue(this.fxBenDetails.canadaInstName);
          } else {
            this.gtFXTransferForm.controls['isBenBankInCanada'].setValue('NO');
          }
          this.gtFXTransferForm.controls['benBiznature'].setValue(this.fxBenDetails.benNatureBusiness);
          this.gtFXTransferForm.controls['BenInstitution'].setValue(this.fxBenDetails.benInstitution);
          this.gtFXTransferForm.controls['relationship'].setValue(this.fxBenDetails.relationship);
        });
  }
  // this function initiates the search logic that displays list of accounts for account to Debit
  SavedFxBeneficiary = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.savedFXBeneficiariesInstance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.savedFXBeneficiaries
      : this.savedFXBeneficiaries.filter(v => v.benName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  );
  }

  savedFxBeneficiariesFormatter = (
    x: {
      benName: string, benBankAcctIBAN: string
    }
  ) => x.benName
  //  + ' - (' + x.accountNumber + ') - ' + x.bank

  setSavedBeneficiariesFXModel(e: NgbTypeaheadSelectItemEvent) {
    // this.newBeneficiaryDetail = null;
    this.savedFXBeneficiariesModel = e.item.benName + ' (' + e.item.benBankAcctIBAN + ') ';
    this.selectedSavedBeneficiaryDetail = e.item;
  }

  acctToChargeTypeahead = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.chargAcctClick$.pipe(filter(() => !this.chargeAcctInstance.isPopupOpen()));
    const inputFocus$ = this.chargAcctFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.acctToDebit
      : this.acctToDebit.filter(v => v.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  );
  }

  chargeAcctformatter = (
    x: {
      accountName: string, nuban: string, accountBalance: string, altCurCode: string,
    }
  ) => x.accountName + ' - ' + x.nuban + '-' + this.cp.transform(x.accountBalance, x.altCurCode, 'symbol')

  ngOnInit() {
    this.createGtTransferForm();
    this.fxacctTodebitForcharge(2);
  }

  ngOnDestroy(): void {

  }

  clear() {
    // this.gtFXTransferForm.controls['acctToDebit'].patchValue('');
    this.acctModel = null;
  }

  // Method that opens the Token confirmation modal
  openTokenConfirmation() {
    let beneficiaryName = '';
    let beneficiaryAcctNo = '';
    if (this.gtFXTransferForm.value.beneficiaryOption === 'SAVED') {
      beneficiaryName = this.gtFXTransferForm.value.BeneName;
      beneficiaryAcctNo = this.gtFXTransferForm.value.BenBankAcctNoIBAN;
    } else if (this.gtFXTransferForm.value.beneficiaryOption === 'NEW') {
      beneficiaryName = this.gtFXTransferForm.value.BeneName;
      beneficiaryAcctNo = this.gtFXTransferForm.value.newBeneficiary;
    }
    // let fxBenSenderRelationship = "";

    if (this.gtFXTransferForm.value.relationship.code === 55) {
      this.fxBenSenderRelationship = this.gtFXTransferForm.value.relationshipOthers;
    } else {
      this.fxBenSenderRelationship = this.gtFXTransferForm.value.relationship.name;
    }
    if (this.gtFXTransferForm.value.fundSource.code === 11) {
      this.fxFundSource = this.gtFXTransferForm.value.others;
    } else {
      this.fxFundSource = this.gtFXTransferForm.value.fundSource.name;
    }
    if (this.gtFXTransferForm.value.biznature.code === 37) {
      this.fxBiznature = this.gtFXTransferForm.value.bizOthers;
    } else {
      this.fxBiznature = this.gtFXTransferForm.value.biznature.name;
    }
    if (this.gtFXTransferForm.value.benBiznature.code === 37) {
      this.fxBenBiznature = this.gtFXTransferForm.value.BenbizOthers;
    } else {
      this.fxBenBiznature = this.gtFXTransferForm.value.benBiznature.name;
    }
    if (this.gtFXTransferForm.value.paymentpurpose.code === 28) {
      this.fxpaymentPurpose = this.gtFXTransferForm.value.paymentpurpose.code;
    } else {
      this.fxpaymentPurpose = this.gtFXTransferForm.value.paymentpurpose.code;
    }
    this.fxPayBody = [
      {
      'amount': this.gtFXTransferForm.value.transferAmt.replace(',', ''),
      'paymentDate': this.formatedDate,
      'paymentPurpose': this.fxpaymentPurpose,
      'reference': '',
      'remark': this.gtFXTransferForm.value.fxTransferRemark,
      'offShoreCharge': this.gtFXTransferForm.value.Offshore,
      'beneficiaryName': beneficiaryName,
      'beneficiaryAddress': this.gtFXTransferForm.value.BeneAddress,
      'beneficiaryBank': this.gtFXTransferForm.value.BenBankname,
      'beneficiaryBankAddress': this.gtFXTransferForm.value.BenBankAddress,
      'beneficiaryCountry': this.gtFXTransferForm.value.countries, // gtFXTransferForm.value.countries.name,
      'beneficiaryCountryCode': this.gtFXTransferForm.value.countries,
      'accountToCredit': beneficiaryAcctNo,
      'beneficiaryBankRoutingNo': this.gtFXTransferForm.value.BenSortCode,
      'beneficiaryBankSWIFT': this.gtFXTransferForm.value.BenSwiftCode,
      'beneficiaryInstitution': this.gtFXTransferForm.value.BenInstitution,
      'intermediaryBankName': this.gtFXTransferForm.value.InterBankName,
      'intermediaryBankAccountNo': this.gtFXTransferForm.value.InterBenBankAcct,
      'intermediaryBankRoutingNo': this.gtFXTransferForm.value.InterBankSortCode,
      'intermediaryBankSWIFT': this.gtFXTransferForm.value.InterBankSwiftCode,
      'intermediaryBenBankAddress': this.gtFXTransferForm.value.InterBankAddress,
      'send_Ben_Relationship': this.fxBenSenderRelationship,
      'beneficiaryBizNature': this.fxBenBiznature,
      'senderBizNature': this.fxBiznature,
      'fundSource': this.fxFundSource,
      'isInterbankRequired': this.gtFXTransferForm.value.isInterbankRequired,
      'beneFiciaryOption': this.gtFXTransferForm.value.beneficiaryOption,
      'repeatTrans': this.gtFXTransferForm.value.SimilarTrans,
      'thirdParty': this.gtFXTransferForm.value.thirdparty,
      'isBenBankInCanada': this.gtFXTransferForm.value.isBenBankInCanada,
      'canadaTransitNo': this.gtFXTransferForm.value.TransitNo,
      'canadaInstName': this.gtFXTransferForm.value.InstitutionNumber,
    }];

    this.reqBody = {
      'accountToDebit': this.gtFXTransferForm.value.acctToDebitFX.fullAcctKey,
      'actToDebitcharge': this.gtFXTransferForm.value.acctToDebit.fullAcctKey,
      'currency': this.selectedCurrency.desc,
      'requestType': 'TRANSFER',
      'purpose': 'Fx-Transfer',
      'secretAnswer': this.gtFXTransferForm.value.secretAnsw,
      'userType': 'USER',
      'TransType': 'DomThirdParty',
      'fxPay': this.fxPayBody,
    };
    console.log(this.reqBody);
    // Show invalid fields and console.log
    const invalidFields = this.util.findInvalidControls(
      this.gtFXTransferForm
    );
    console.log(invalidFields); // For dubugging purposes
    this.formSubmit = true;
  }
  // test() {
  //   console.log('test');
  //   console.log(this.gtFXTransferForm.value.countries);
  //   console.log(this.gtFXTransferForm.value);
  // }
  createGtTransferForm() {
    this.gtFXTransferForm = this.fb.group({
      'acctToDebitFX': ['', Validators.required],
      'transferAmt': ['', Validators.required],
      'acctToDebit': ['', Validators.required],
      'fundSource': ['', Validators.required],
      'others': '',
      'biznature': ['', Validators.required],
      'bizOthers': '',
      'beneficiaryOption': ['SAVED', Validators.required],
      'newBeneficiary': '',
      'savedFxBeneficiary': '',
      'BeneName': '',
      'BeneAddress': '',
      'countries': ['', Validators.required],
      'benBiznature': ['', Validators.required],
      'BenbizOthers': '',
      'BenInstitution': '',
      'relationship': ['', Validators.required],
      'relationshipOthers': '',
      'BenBankname': ['', Validators.required],
      'BenBankAddress': ['', Validators.required],
      'BenSwiftCode': '',
      'BenBankAcctNoIBAN': ['', Validators.required],
      'BenSortCode': '',
      'isInterbankRequired': 'NO',
      'InterBankName': [''],
      'InterBankAddress': [''],
      'InterBankSwiftCode': '',
      'InterBenBankAcct': [''],
      'InterBankSortCode': '',
      'isBenBankInCanada': 'NO',
      'TransitNo': [''],
      'InstitutionNumber': [''],
      'Notice': ['', Validators.required],
      'TermConditions': ['', Validators.required],
      'SimilarTrans': 'NO',
      'thirdparty': 'NO',
      'Offshore': 'Locally',
      'paymentpurpose': ['', Validators.required],
      'paymentPurposeOthers': '',
      'fxTransferRemark': '',
      'secretAnsw': ['', Validators.required]
    });
  }

  public onkey(nuban: string) {
    if (nuban.length === 10) {
      this.loadingBeneficiary = true;
      this.errorMessage = '';
      this.customerService.getBeneficiary(nuban, '058')
        .pipe(untilComponentDestroyed(this))
      .subscribe(
          (res: Beneficiary) => {
            console.log(res);
            if (res.responseCode === '00') {
              this.gtFXTransferForm.controls['newBeneficiary'].patchValue(res.accountName);
              this.newBeneficiaryDetail = res;
              console.log('Beneficiary Details' + JSON.stringify(this.newBeneficiaryDetail));
              this.errorMessage = '';
              this.loadingBeneficiary = false;
            } else {
              this.errorMessage = `Unable to verify ${nuban}. Check that account number is correct`;
              this.successMessage = '';
            }
          },
          (err: HttpErrorResponse) => {
            console.log(err.error);
          }
        );
    } else if (nuban.length > 10) {
      this.successMessage = '';
      this.errorMessage = 'nuban entered is greater than 10 digit';
    } else {
      this.successMessage = '';
      this.errorMessage = 'Enter 10 digit NUBAN';
    }

  }

  clearBeneficiary() {
    this.gtFXTransferForm.controls['savedFxBeneficiary'].patchValue('');
    this.gtFXTransferForm.controls['newBeneficiary'].patchValue('');
    this.newBeneficiaryDetail = '';
    // this.gtFXTransferForm.value = '';
    /* {
      accountName: '',
      nuban: '',
      oldAccountNo: '',
      requestId: '',
      responseCode: '',
      responseDescription: ''
    }; */
    this.successMessage = '';
  }

}
