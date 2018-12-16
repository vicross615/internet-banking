import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AcctToDebit, AcctToDebitFX,
  Beneficiary, Beneficiaries,
  FundsSource, BizNature, RelFxTrans, Country, Purpose } from '../_customer-model/customer.model';
import { CustomerService } from '../_customer-service/customer.service';
import { distinctUntilChanged, filter, map, debounceTime, merge } from 'rxjs/operators';
import { UtilitiesService } from '../../_services/utilities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { TransferService } from '../transfers/_services/transfer.service';
import { CurrencyPipe } from '@angular/common';
import { Modal } from '../transfers/transfer-message-modal/modal.model';
// import { TokenConfirmationModalComponent } from '../token-confirmation-modal/token-confirmation-modal.component';

@Component({
  selector: 'app-fx',
  templateUrl: './fx.component.html',
  styleUrls: [
    './fx.component.scss',
    '../../../assets/icon/icofont/css/icofont.css',
    '../../../../node_modules/sweetalert2/src/sweetalert2.scss'
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

export class FxComponent implements OnInit {
  public gtFXTransferForm: FormGroup;
  public acctToDebitFX: AcctToDebitFX = null;
  acctToDebitFXModel: AcctToDebitFX;
  public acctToDebit: AcctToDebit = null;
  acctToDebitModel: AcctToDebit;
  modal: Modal = new Modal();
  currencies: Array<object>;
  countries: Country[];
  paymentpurpose: Purpose[];
  selectedCurrency: any;
  public savedFXBeneficiaries: Array<Beneficiaries> = [];
  savedFXBeneficiariesModel: string;
  FXbeneficiaryLabel = 'Enter Beneficiary`s name';
  transferLimit = 0.00;
  successMessage = '';
  errorMessage = '';
  public newBeneficiaryDetail: any;
  public selectedSavedBeneficiaryDetail: Beneficiaries;
  isLoading: boolean;
  loadingBeneficiary: boolean;
  public fundSource: FundsSource[];
  public biznature: BizNature[];
  public relationship: RelFxTrans[];
  FxfundSourceModel: string;
  FxbizNatureModel: string;
  FXRelationshipModel: string;
  countries_Instance_Model: string;
  FxpaymentpurposeModel: string;


  @ViewChild('acctToDebitFXInstance') acctToDebitFXInstance: NgbTypeahead;
  @ViewChild('savedFXBeneficiariesInstance') savedFXBeneficiariesInstance: NgbTypeahead;
  @ViewChild('acctToDebitInstance') acctToDebitInstance: NgbTypeahead;
  @ViewChild('fundSourceInstance') fundSourceInstance: NgbTypeahead;
  @ViewChild('bizNatureInstance') bizNatureInstance: NgbTypeahead;
  @ViewChild('relationshipInstance') relationshipInstance: NgbTypeahead;
  @ViewChild('nationalityInstance') nationalityInstance: NgbTypeahead;
  @ViewChild('fxpaymentpurposeInstance') fxpaymentpurposeInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focusfs$ = new Subject<string>();
  clickfs$ = new Subject<string>();
  focusbz$ = new Subject<string>();
  clickbz$ = new Subject<string>();
  focusR$ = new Subject<string>();
  clickR$ = new Subject<string>();
  countryfocus$ = new Subject<string>();
  countryclick$ = new Subject<string>();


  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    private util: UtilitiesService,
    private cp: CurrencyPipe,
    private modalService: NgbModal
  ) {
  }

  // tslint:disable-next-line:one-line
  ngOnInit(){

  }

}
