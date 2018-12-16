import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})

export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavChange = false;

  constructor(private router: Router) {
    // Clear the alert message
    router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          if (this.keepAfterNavChange) {
            this.keepAfterNavChange = false;
          } else {
            this.subject.next();
          }
        }
      }
    );
   }

   successAlert(message: string, keepAfterNavChange = false) {
     this.keepAfterNavChange = keepAfterNavChange;
     this.subject.next({
       type: 'success',
       text: message
     });
   }

   errorAlert(message: string, keepAfterNavChange = false) {
    this.keepAfterNavChange = keepAfterNavChange;
    this.subject.next({
      type: 'error',
      text: message
    });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}
