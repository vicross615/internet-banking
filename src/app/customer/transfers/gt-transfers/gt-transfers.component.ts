import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable,  Subject} from 'rxjs';
import { NgbTypeaheadSelectItemEvent, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Beneficiary, Beneficiaries, AcctToDebit, AcctDetails } from '../../_customer-model/customer.model';
import { CustomerService } from '../../_customer-service/customer.service';
import { distinctUntilChanged, filter, map, debounceTime, merge} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TransferService } from '../_services/transfer.service';
import { CurrencyPipe } from '@angular/common';
import { UtilitiesService } from '../../../_services/utilities.service';
import { UserService } from '../../../_services/user.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


// component decorator
@Component({
  selector: 'app-gt-transfers',
  templateUrl: './gt-transfers.component.html',
  // styles: [`.form-control { width: 300px; display: inline; }`],
  styleUrls: ['./gt-transfers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // Animation
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

export class GtTransfersComponent implements OnInit, OnDestroy {
  public gtTransferForm: FormGroup;
  public acctToDebit: Array<any> = [];
  public savedBeneficiaries: Beneficiaries[];
  savedBeneficiariesModel: string;
  beneficiaryLabel = 'Enter Beneficiary`s name';
  transferLimit = 0.00;
  successMessage = '';
  errorMessage = '';
  public newBeneficiaryDetail: any;
  public selectedSavedBeneficiaryDetail: Beneficiaries;
  isLoading: boolean;
  loadingBeneficiary: boolean;
  public accountToDebit: AcctToDebit = null;
  public formSubmit = false;
  public reqBody: Object;
  beneficiaryMessage: string;
  showErrorMessage = false;
  selectedAcct: AcctDetails;

  @ViewChild('savedBeneficiariesInstance') savedBeneficiariesInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  charges: any;
  chargesError: string;


  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private customerService: CustomerService,
    public util: UtilitiesService,
    private userService: UserService,
    // private cp: CurrencyPipe
  ) {
    this.util.charges$.subscribe(c => this.charges = c);
    this.util.chargesError$.subscribe(err => this.chargesError = err);
    this.customerService.getBeneficiariesData('GTBThirdParty');
    this.customerService.beneficiaries$
    .subscribe(
      beneficiaries => {
        this.savedBeneficiaries = beneficiaries;
        for (const h of this.savedBeneficiaries ) {
          if (h.imageString === '') {
            h.image = 'assets/images/placeholder.png';
          } else {
            h.image = `data:image/jpg;base64,${h.imageString}`;
          }
        }
        console.log(this.savedBeneficiaries);
      });

    this.createGtTransferForm();
    this.returnTransferLimit();
    this.customerService.selectedAcctDetail$.pipe(untilComponentDestroyed(this))
    .subscribe(acct => this.selectedAcct = acct);
  }

  ngOnDestroy(): void {

  }

  acctToDebitEventHander($event: any) {
    this.accountToDebit = $event;
    console.log('parent: ' + JSON.stringify(this.accountToDebit));
    this.gtTransferForm.controls['acctToDebit'].patchValue($event);
    this.util.getChargesData(this.accountToDebit.nuban, '235');
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createGtTransferForm();
      this.customerService.getAcctToDebitData();
    }
  }

  changeLabel(label: string) {
      this.beneficiaryLabel = label;
  }

    // this function initiates the search logic that displays list of accounts for account to Debit
  SavedBeneficiary = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    merge(this.focus$),
    merge(this.click$.pipe(filter(() => !this.savedBeneficiariesInstance.isPopupOpen()))),
    map(
      term => term === null ? []
      : this.savedBeneficiaries
      .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
      .slice(0, 10).filter(v => v.bank === 'GUARANTY TRUST BANK PLC')
    )
  )

  savedBeneficiariesFormatter = (
    x: {
      name: string, accountNumber: string, bankCode: string, bank: string
    }
  ) => x.name
  //  + ' - (' + x.accountNumber + ') - ' + x.bank

  setSavedBeneficiariesModel(e: NgbTypeaheadSelectItemEvent) {
    // this.newBeneficiaryDetail = null;
    this.savedBeneficiariesModel = e.item.name + ' -(' + e.item.accountNumber + ') ' + e.item.bank;
    // this.selectedSavedBeneficiaryDetail = e.item;
}

  ngOnInit() {
    console.log('gtforms');

  }

  // Method that ruturns transfer limit
  public returnTransferLimit() {
    this.transferService.getTransferLimit()
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res) => {
          console.log(res);
          if (res.responseCode === '00') {
            this.transferLimit = Number(res.remainingLimit);
          } else {
            this.transferLimit = this.util.handleResponseError(res);
          }
      },
      (err: any) => {
        this.transferLimit = err;
        console.error('Session is expired, please Login');
        console.log(err);
      }
    );
  }

   /*
     formatCurrency(amt) {
    this.gtTransferForm.controls['transferAmt']
    .setValue( `${this.cp.transform(amt, '₦')}`);
  }
   */



  public onkey(nuban: string) {
    if (nuban.length === 10) {
      this.loadingBeneficiary = true;
      this.errorMessage = '';
      this.customerService.getBeneficiary(nuban, '058')
      .subscribe(
        (res: Beneficiary) => {
            console.log(res);
            if (res.responseCode === '00') {
              // this.gtTransferForm.controls['newBeneficiary'].patchValue(res.accountName);
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

  // Method that opens the Token confirmation modal
  openTokenConfirmation() {
    let beneficiaryName = '';
    let beneficiaryAcctNo = '';
    if (this.gtTransferForm.value.beneficiaryOption === 'SAVED') {
      beneficiaryName = this.gtTransferForm.value.savedBeneficiary.name;
      beneficiaryAcctNo = this.gtTransferForm.value.savedBeneficiary.accountNumber;
    } else if (this.gtTransferForm.value.beneficiaryOption === 'NEW') {
      beneficiaryName = this.newBeneficiaryDetail.accountName;
      beneficiaryAcctNo = this.newBeneficiaryDetail.nuban;
    }
    this.reqBody = {
      'accountToDebit': this.util.extEncrypt(this.gtTransferForm.value.acctToDebit.nuban),
      'accountToCredit': this.util.extEncrypt(beneficiaryAcctNo),
      'beneName': beneficiaryName,
      'amount': this.gtTransferForm.value.transferAmt.replace(',', ''),
      'type': 2,
      'requestType': 'TRANSFER',
      'purpose': '3rdParty Intra-Transfer',
      'secretAnswer': this.util.extEncrypt(this.gtTransferForm.value.secretAnsw),
      'remark': this.gtTransferForm.value.remark,
    };
    this.formSubmit = true;
    console.log(this.reqBody);
  }
  // this method creates a reactive form for GT to GT transfers
  createGtTransferForm() {
    this.gtTransferForm = this.fb.group({
      'acctToDebit': [this.accountToDebit, Validators.required],
      'beneficiaryOption': ['SAVED', Validators.required],
      'newBeneficiary': '',
      'savedBeneficiary': '',
      'transferAmt': ['', Validators.required],
      'remark': '',
      'secretAnsw': ['', Validators.required]
    });
  }

  clearBeneficiary() {
    this.createGtTransferForm();
    this.gtTransferForm.controls['savedBeneficiary'].patchValue('');
    this.gtTransferForm.controls['newBeneficiary'].patchValue('');
    this.newBeneficiaryDetail = '';
    /* {
      accountName: '',
      nuban: '',
      oldAccountNo: '',
      requestId: '',
      responseCode: '',
      responseDescription: ''
    }; */
    this.successMessage = '';
    this.customerService.getBeneficiariesData('GTBThirdParty');
  }


  saveBeneficiary(beneficiary: any) {
    this.beneficiaryMessage = 'Saving beneficiary..';
    this.reqBody = {
      'BeneficiaryName': beneficiary.accountName,
      'BeneficiaryAccount': beneficiary.nuban,
      'BeneficiaryBankCode': '058',
      'TransactionType': ' GTBThirdParty',
      'BeneficiaryLinktypes': 0,
      'CustomerIdentifier': this.selectedAcct.map_acc_no,
      'CustomerIdentifierType': 0,
      'secretAnswer': '',
    };
    console.log(this.reqBody);
    this.customerService.getBeneficiariesData('GTBThirdParty');
    this.transferService.manageBeneficiaryRequest(this.reqBody)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.beneficiaryMessage = 'Beneficiary was saved Successfully!';
          this.clearBeneficiary();
        } else {
          this.beneficiaryMessage = 'Failed to save beneficiary. Try again';
        }
        this.removeError();
      },
      (err: any) => {
        console.log(err);
        this.beneficiaryMessage = 'Failed to save beneficiary. Try again';
        this.removeError();
      }
    );
    this.reqBody = null;
    console.log(this.beneficiaryMessage);
  }


  deleteBeneficiary(beneficiary: Beneficiaries) {
    this.beneficiaryMessage = 'Deleting beneficiary..';
    this.reqBody = {
      'BeneficiaryName': beneficiary.name,
      'BeneficiaryAccount': beneficiary.accountNumber,
      'BeneficiaryBankCode': beneficiary.bankCode,
      'TransactionType': 'GTBThirdParty',
      'BeneficiaryLinktypes': 1,
      'CustomerIdentifier': this.selectedAcct.map_acc_no,
      'CustomerIdentifierType': 0,
      'secretAnswer': '',
    };
    this.customerService.getBeneficiariesData('GTBThirdParty');
    this.transferService.manageBeneficiaryRequest(this.reqBody)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.beneficiaryMessage = 'Beneficiary deleted Successfully!';
          this.clearBeneficiary();
        } else {
          this.beneficiaryMessage = 'Failed to delete beneficiary. Try again';
        }
        this.removeError();
      },
      (err: any) => {
        console.log(err);
        this.beneficiaryMessage = 'Failed to delete beneficiary. Try again';
        this.removeError();
      }
    );
    this.reqBody = null;
    console.log(this.beneficiaryMessage);
  }

  removeError() {
    setTimeout(() => {
      this.beneficiaryMessage = '';
    }, 2000);
  }



}
