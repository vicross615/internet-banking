import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { retry, catchError } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Injectable({
  providedIn: 'root'
})
export class GenerateStatementService implements OnDestroy {
  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;

  private destinationListSource = new BehaviorSubject<any[]>([]);
  destinationList$ = this.destinationListSource.asObservable();
  private destinationListErrorSource = new BehaviorSubject<string>('');
  destinationListError$ = this.destinationListErrorSource.asObservable();

  private statementDetailsSource = new BehaviorSubject<EmbassyStatementDetails[]>([]);
  private statementDetailsErrorSource = new BehaviorSubject<string>('');
  statementDetails$ = this.statementDetailsSource.asObservable();
  statementDetailsError$ = this.statementDetailsErrorSource.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
  ) { }

  sendStatement(body) {
    const PATH = this.CUST_URL + `/Statement`;
    // Add customer related properties to the body object
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  ngOnDestroy(): void {

  }


  getDestinationList(destinationType): Observable<any> {
    const PATH = this.CUST_URL + `/EmbassyDestinationList`;
    let body = {
      'type': '1',
      'country': 'NG',
      'destinationType': destinationType,
    };
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getDestinationListData(destinationType) {
    this.getDestinationList(destinationType).pipe(untilComponentDestroyed(this))
      .subscribe(
        (res: any) => {
          console.log(res); // Delete this
          if (res.responseCode === '00') {
            this.updateDestinationListError('');
            this.updateDestinationList(res.destinationDetails);
          } else {
            this.updateDestinationListError(this.util.handleResponseError(res));
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }

  updateDestinationList(list) {
    this.destinationListSource.next(list);
  }

  updateDestinationListError(err) {
    this.destinationListErrorSource.next(err);
  }

  getStatementCharges(body: any): Observable<any> {
    const PATH = this.CUST_URL + `/StatementAmount`;
    let reqBody: any = {};
    reqBody.accountNumber = body.statementAccount;
    reqBody.startDate = body.startDate;
    reqBody.endDate = body.endDate;
    reqBody.statementType = body.statementType;
    // Add customer related properties to the body object
    reqBody = this.util.addAuthParams(reqBody);
    console.log(reqBody); // for debugging only
    return this.http.post<Response>(PATH, reqBody)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getStatementDetails(): Observable<any> {
    const PATH = this.CUST_URL + `/EmbassyStatementHistory`;
    let body: any = {};
    body = this.util.addAuthParams(body);
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getStatementDetailsData() {
    this.getStatementDetails().subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.updateStatementDetailsError('');
          this.updateStatementDetails(res.embassyStatementDetails);
        } else {
          this.updateDestinationListError(this.util.handleResponseError(res));
          this.updateStatementDetails(null);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  updateStatementDetails(list) {
    this.statementDetailsSource.next(list);
  }

  updateStatementDetailsError(err) {
    this.statementDetailsErrorSource.next(err);
  }


}

// MODEL
export class DestinationList {
  constructor(
    public destination?: string,
    public destinationID?: string,
    public categoryID?: string,
    public categoryName?: string,
  ) { }
}

export class EmbassyStatementDetails {
  constructor(
    public ticketId?: string,
    public accountNo?: string,
    public numberOfPages?: string,
    public amount?: string,
    public applicants?: string,
    public requestDate?: string,
    public channel?: string,
  ) { }
}
