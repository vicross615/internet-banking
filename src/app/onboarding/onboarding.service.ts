import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { UtilitiesService } from '../../app/_services/utilities.service';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private CUST_URL = environment.BASE_URL + environment.CUST_SERV;

  private AUTH_URL = environment.BASE_URL + environment.AUTH_API

  constructor(private http: HttpClient, private util: UtilitiesService) {}

  updateIndemnityStatus() {
    const PATH = this.AUTH_URL + `/Accept-Indemnity`;
    let body = {};
    body = this.util.addAuthParams(body);
    console.log('Indemnityresponse: ' + JSON.stringify(body));
    return this.http.post<any>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }

  setSecretQuestion(body) {
    const PATH = this.AUTH_URL + `/Set-Secret-Answer`;
     body = {
     'ReminderQuestion': body.secQuestion,
     'ReminderAnswer': body.secAnswer,
    };
    body = this.util.addAuthParams(body);
    console.log('Secret Question: ' + JSON.stringify(body));
    return this.http.post<any>(PATH, body)
      .pipe(
      retry(3),
      catchError(this.util.handleError)
      );
  }


}
