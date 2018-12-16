import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { throwError as _throw, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { retry, catchError } from 'rxjs/operators';
import { UtilitiesService } from '../../../_services/utilities.service';


@Injectable({
  providedIn: 'root'
})
export class ViewprofileService {
  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;

  constructor(

    private http: HttpClient,
    private util: UtilitiesService,
      private router: Router,
    ) { }

  viewProfile(body) {
    const PATH = this.CUST_URL + `/CustomerValidationMoreRecord`;
    // Add customer related properties to the body object
    body.category = 0;
    body = this.util.addAuthParams(body);
    // body.customerNumber = '';
    delete body.customerID;
    console.log(body); // for debugging only
    return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }
}
