import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilitiesService } from '../../../_services/utilities.service';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InvestmentStatusService {
  private Req_URL = environment.BASE_URL + environment.REQ_SERV;
    // Observable: Investments Stattus
    private investmentsSource = new Subject<any[]>();
    investments$ = this.investmentsSource.asObservable();
    private investmentsErrorSource = new Subject<string>();
    investmentsError$ = this.investmentsErrorSource.asObservable();

  constructor(
    private http: HttpClient,
    private util: UtilitiesService,
    private router: Router
  ) { }

  getInvestments(): Observable<any> {
    const PATH = this.Req_URL + `/Investment`;
    let body = {};
    body = this.util.addAuthParams(body);
    return this.http.post<Response>(PATH, body).pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  async getInvestmentsData() {
    this.getInvestments().subscribe(
        res => {
          console.log(res);
          if (res.responseCode === '00') {
            this.updateInvestments(res.investments);
            this.updateInvestmentsError(null);
          } else {
            this.updateInvestments(null);
            this.updateInvestmentsError(this.util.handleResponseError(res));
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.updateInvestmentsError(err);
          this.updateInvestments(null);
        }
      );
  }

  updateInvestments(investments) {
    this.investmentsSource.next(investments);
  }

  updateInvestmentsError(message) {
    this.investmentsErrorSource.next(message);
  }


}
