import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { environment } from '../../../../environments/environment';
import { UtilitiesService } from '../../../_services/utilities.service';
import { User } from '../../../_models/user';
import { UserService } from '../../../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordresetService {

  public AUTH_URL = environment.BASE_URL + environment.AUTH_API;

  constructor(
    private http: HttpClient,
    public util: UtilitiesService,
    private userService: UserService 
  ) { }



  PassWordReset(body): Observable<any> {
    const PATH = this.AUTH_URL + `/Change-Password`;
    // const user = JSON.parse(localStorage.getItem('userDetails'));
    let reqBody = {
      'oldpassword' : body.PasswordOld,
      'newpassword' :  body.PasswordNew,
      'confirmpassword' : body.PasswordConfirm
    };
    reqBody = this.util.addAuthParams(reqBody);
    console.log(reqBody); // for debugging only
      return this.http.post<Response>(PATH, reqBody)     // remember to change the response description from question to answer
      .pipe(
        retry(3),
        catchError(this.util.handleError)
      );
  }
}
