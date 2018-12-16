import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AcctToDebit, AcctDetails } from '../../_customer-model/customer.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesService } from '../../../_services/utilities.service';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { GenerateStatementService, DestinationList, EmbassyStatementDetails } from './generate-statement.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { IbankNotifications } from '../../../shared/ibank-notifications/ibank-notifications.component';
import { CurrencyPipe } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-generate-statement',
  templateUrl: './generate-statement.component.html',
  styleUrls: ['./generate-statement.component.scss'],
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
export class GenerateStatementComponent implements OnInit, OnDestroy {
  public notifications: IbankNotifications = {};
  sendStatementForm: FormGroup;
  destinationList: DestinationList[];
  destinationModel: AcctToDebit;
  destinationLabel = 'Enter Country';
  destinationError: string;
  successMessage = '';
  errorMessage = '';
  isLoading: boolean;
  startDateModel: any;
  endDateModel: any;
  formSubmit = false;
  reqBody: Object;
  showHistory = false;
  statementDetails: EmbassyStatementDetails[];
  statementDetailsError: string;

  @ViewChild('destinationInstance') destinationInstance: NgbTypeahead;
  destinationFocus$ = new Subject<string>();
  destinationClick$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private service: GenerateStatementService,
    private util: UtilitiesService,
    private cp: CurrencyPipe,
  ) {
    this.service.getStatementDetailsData();
    this.service.statementDetails$.subscribe(d => this.statementDetails = d);
    this.service.statementDetailsError$.subscribe(err => this.statementDetailsError = err);
    this.service.destinationList$.pipe(untilComponentDestroyed(this))
    .subscribe(list => this.destinationList = list);
    this.service.destinationListError$.pipe(untilComponentDestroyed(this))
    .subscribe(err => this.destinationError = err);
    this.createSendStatementForm();
  }

  ngOnDestroy(): void {

  }

  setNotification(type, title, msg) {
    this.notifications.message = msg;
    this.notifications.title = title;
    this.notifications.type = type;
  }

  visibilityHandler($event) {
    if ($event === true) {
      this.notifications = {};
    }
  }

  acctToDebitEventHandler($event: any) {
    console.log('parent: ' + JSON.stringify($event));
    this.sendStatementForm.controls['accountToDebit'].patchValue($event);
  }

  statementAccountEventHandler($event: any) {
    console.log('parent Account to Send: ' + JSON.stringify($event)); // Delete
    this.sendStatementForm.controls['statementAccount'].patchValue($event);
  }

  tokenEventHandler($event: any) {
    this.formSubmit = $event;
  }

  resetFormEventHandler($event) {
    if ($event === true) {
      this.createSendStatementForm();
    }
  }

  destinationListTypeahead = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.destinationClick$.pipe(filter(() => !this.destinationInstance.isPopupOpen()));
    const inputFocus$ = this.destinationFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.destinationList
      : this.destinationList
      .filter(v => v.destination.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)
      .sort(function(a, b) {
        const x = a.destination.toLowerCase();
        const y = b.destination.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      })
    )
  );
  }

  formatter = ( x: { destination: string } ) => x.destination;

  ngOnInit() { console.log(this.sendStatementForm.controls['statementType'].value); }

  changeDestinationList(value) {
    console.log(value);
    this.service.updateDestinationList('');
    this.service.updateDestinationListError('');
    this.service.getDestinationListData(value);
    switch (value) {
      case '1':
        this.destinationLabel = 'Enter Country';
        break;
      case '2':
        this.destinationLabel = 'Enter name of Third Part';
        break;

      default:
        break;
    }
    this.sendStatementForm.controls['destination'].reset();
    this.sendStatementForm.controls['statementType'].patchValue(value);
    console.log(this.sendStatementForm.controls['statementType'].value);
  }


  createSendStatementForm() {
    this.sendStatementForm = this.fb.group({
      'statementType': ['1', Validators.required],
      'destination': ['', Validators.required],
      'statementAccount': ['', Validators.required],
      'role': ['', Validators.required],
      'applicant': ['', Validators.required],
      'startDate': ['', Validators.required],
      'endDate': ['', Validators.required],
      'accountToDebit': ['', Validators.required],
    });
  }

  openTokenConfirmation(formValues) {
    console.log(formValues);
    formValues.startDate = this.util.formatDate(formValues.startDate);
    formValues.endDate = this.util.formatDate(formValues.endDate);
    formValues.statementAccount = formValues.statementAccount.nuban;
    formValues.accountToDebit = formValues.accountToDebit.fullAcctKey;
    formValues.destination = formValues.destination.destinationID;
    this.reqBody = formValues;
    this.getCharges(this.reqBody);
    console.log(this.reqBody);
  }

  getCharges(body) {
    this.isLoading = true;
    this.service.getStatementCharges(body).pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.setNotification(
            'info',
            'Confirm Transaction Charges',
            `<ul class="text-dark text-left f-14 mt-4">
            <li class="p-2 mb-1 bg-light b-radius-5">
            <span class="f-w-500">Charges: </span>
            <span class="float-right">
            ${this.cp.transform(res.message.amount, '₦')}
            </span>
            </li>
            <li class="p-2 mb-1 bg-light b-radius-5">
            <span class="f-w-500">Number of pages: </span>
            <span class="float-right">
            ${res.message.noOfPages}
            </span>
            </li>
            </ul>
            Click 'OK' to proceed.`
          );
          this.formSubmit = true;
          this.isLoading = false;
        } else {
          this.setNotification(
            'error',
            'Request Error',
            `${ this.util.handleResponseError(res)}. Please Try again`
          );
          this.formSubmit = false;
          this.isLoading = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.setNotification(
          'error',
          'Request Error',
          `${err}. Please Try again`
        );
        console.log(err);
      }
    );
    console.log('t');
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.service.getStatementDetailsData();
    }
  }


}
