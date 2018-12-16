import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { ViewprofileService } from '../view-profile/viewprofile.service';
import { AccountDetailsResponse, AccountDetails } from '../view-profile/view-profile';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ],
})
export class ViewProfileComponent implements OnInit, OnDestroy {

  public accountDetailsFull: AccountDetailsResponse;
  public accountDetails: AccountDetails[];
  errorMessage: string;
  formError: string;
  loading = false;

  constructor(
    private viewprofileService: ViewprofileService,
  ) { }

  ngOnInit() {
    this.viewUserSettings();
  }

  ngOnDestroy(): void {

  }

  viewUserSettings() {

    const body = { 'category': 0 };
    this.viewprofileService.viewProfile(body)
    .pipe(untilComponentDestroyed(this))
      .subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.accountDetailsFull = res;
        } else {
          this.errorMessage = res.responseDescription;
        }
      },
      err => {
        console.log(err);
        this.errorMessage = 'We are sorry. Our service is currently down';
      }
      );
  }




}
