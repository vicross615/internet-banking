import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { User } from '../_models/user';
import { UserService } from './user.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Injectable({providedIn: 'root'})
export class AuthService implements OnDestroy {

  public AUTH_URL = environment.BASE_URL + environment.AUTH_API;

  constructor(
    private http: HttpClient,
    public util: UtilitiesService,
    private userService: UserService ) {}

  login(credentials): Observable<any> {
    console.log(credentials);
    const PATH = this.AUTH_URL + `/IbankLogin`;

    return this.http.post<any>(PATH, credentials)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  logout(): Observable<any> {
    const user = this.userService.getUserDetails();
    const data = {
      'requestID' : this.util.generateRequestId(),
      'userID'  : user.userId
    };
    console.log(data);
    const PATH = this.AUTH_URL + `/Logout`;
    return this.http.post<any>(PATH, data)
    .pipe(
      retry(3),
      catchError(this.util.handleError)
    );
  }

  ibankLogout() {
    this.logout().pipe(untilComponentDestroyed(this)) // <--- method to unsubscribe when comp destroys
    .subscribe(
      (res: any) => {
        if (res.responseCode) { // if Login is successful
          console.log(res); // this is only for debugging purpose
          this.clearLocalStorage();
          console.log('logout Successful');
          }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  clearLocalStorage() {
    const userName = (localStorage.getItem('userName') ? localStorage.getItem('userName') : '');
    localStorage.clear();
    localStorage.setItem('userName', userName);
    this.userService.updateUser('');
  }

  ngOnDestroy(): void {

  }


}
