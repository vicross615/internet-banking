import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notifications } from '../_customer-model/customer.model';
import { UtilitiesService } from '../../_services/utilities.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Injectable({
  providedIn: 'root'
})
export class GtNotificationsService implements OnDestroy {
  private REQ_URL = environment.BASE_URL + environment.REQ_SERV;

  private notificationsSource = new BehaviorSubject<Notifications[]>(null);
  notifications$ = this.notificationsSource.asObservable();
  private notificationsErrorSource = new BehaviorSubject<string>('');
  notificationsError$ = this.notificationsErrorSource.asObservable();

  constructor(
    private util: UtilitiesService,
    private http: HttpClient
  ) { }

  ngOnDestroy(): void {

  }

   // Query funtion that returns accounts from the API.
   getNotifications(): Observable<any> {
    const PATH = this.REQ_URL + `/GetNotification`;
      let body = {};
      body = this.util.addAuthParams(body);
      return this.http.post<Response>(PATH, body)
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }

  getNotifiactionsData() {
    this.getNotifications()
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      (res: any) => {
        console.log(res); // Delete this
        if (res.responseCode === '00') {
          this.notificationsErrorSource.next('');
          this.notificationsSource.next(res.notificationList);
        } else {
          this.notificationsErrorSource.next(this.util.handleResponseError(res));
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

}
