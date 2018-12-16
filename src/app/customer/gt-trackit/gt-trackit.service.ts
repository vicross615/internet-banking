import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GtTrackit, DropdownList } from './gt-trackit.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilitiesService } from '../../_services/utilities.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Injectable({
  providedIn: 'root'
})
export class GtTrackitService implements OnDestroy {
  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;
  // Observable sources
  private gtTractItSource = new BehaviorSubject<GtTrackit[]>([]);
  private requestTypeSource = new BehaviorSubject<DropdownList[]>([]);
  private selectedRequestTypeSource = new BehaviorSubject<DropdownList>({});
  private searchCriteriaSource = new BehaviorSubject<DropdownList[]>([]);
  private selectedSearchCriteriaSource = new BehaviorSubject<DropdownList>({});
  private errorSource = new BehaviorSubject<string>(null);
  // Observable streams
  gtTrackIt$ = this.gtTractItSource.asObservable();
  requestType$ = this.requestTypeSource.asObservable();
  selectedRequestType$ = this.selectedRequestTypeSource.asObservable();
  searchCriteria$ = this.searchCriteriaSource.asObservable();
  selectedSearchCriteria$ = this.selectedSearchCriteriaSource.asObservable();
  Error$ = this.errorSource.asObservable();

  constructor(
    private util: UtilitiesService,
    private http: HttpClient
  ) { }

  ngOnDestroy(): void {
  }

  // ======================= GT TrackIT ========================
  requestTypes(): Observable<any> {
    const PATH = this.CUST_URL + `/GtTrackItRequestTypes`;
    let body: any = {};
    body = this.util.addAuthParams(body);
    delete body.customerID;
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  searchCriteria(): Observable<any> {
    const PATH = this.CUST_URL + `/GtTrackItSearchCriteria`;
    let body: any = {};
    body = this.util.addAuthParams(body);
    delete body.customerID;
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  gtTrackItList(reqBody): Observable<any> {
    const PATH = this.CUST_URL + `/GTTrackITList`;
    let body: any = {};
    body.requestType = reqBody.requestType;
    body.searchCriteria = reqBody.searchCriteria;
    body.startDate = reqBody.startDate;
    body.endDate = reqBody.endDate;
    body.trackingId = reqBody.trackingId;
    body = this.util.addAuthParams(body);
    delete body.customerID;
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  getGTTrackItList(reqBody) {
    this.updateError('');
    this.gtTrackItList(reqBody).pipe(untilComponentDestroyed(this))
    .subscribe(
      res => {
        console.log(res);
        if (res.responseCode === '00') {
          this.updateGtTrackItList(res.trackItResponses);
        } else {
          this.updateError(this.util.handleResponseError(res) + '. ' + res.message);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateError(err);
      }
    );
  }

  getRequestType() {
    this.requestTypes().pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        if (res.responseCode === '00') {
          this.updateRequestType(res.dropDownList);
          this.updateSelectedRequestType(res.dropDownList[1]);
        } else {
          this.updateError(this.util.handleResponseError(res));
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateError(this.util.handleResponseError(err));
      }
    );
  }

  getSearchCriteria() {
    this.searchCriteria().pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        if (res.responseCode === '00') {
          this.updateSearchCriteria(res.dropDownList);
          this.updateSelectedSearchCriteria(res.dropDownList[0]);
        } else {
          this.updateError(this.util.handleResponseError(res));
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.updateError(this.util.handleResponseError(err));
      }
    );
  }

  updateGtTrackItList(list) {
    this.gtTractItSource.next(list);
  }

  updateSearchCriteria(list) {
    this.searchCriteriaSource.next(list);
  }

  updateRequestType(list) {
    this.requestTypeSource.next(list);
    console.log(list);
  }

  updateSelectedSearchCriteria(item) {
    this.selectedSearchCriteriaSource.next(item);
  }

  updateSelectedRequestType(item) {
    this.selectedRequestTypeSource.next(item);
  }

  updateError(err) {
    this.errorSource.next(err);
  }
}
