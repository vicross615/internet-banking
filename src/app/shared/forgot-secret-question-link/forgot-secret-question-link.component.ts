import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegistrationService } from '../../onboarding/registration/registration.service';
import { UserService } from '../../_services/user.service';
import { UtilitiesService } from '../../_services/utilities.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'get-secret-question',
  template: ` <span class="float-right pb-2 gt-clickable">
                <a [@fadeInOutTranslate] (click)="getSecretQuestion()" class="f-10 f-w-500 text-primary">
                {{message}}
                </a>
                </span>`,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('800ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('500ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class ForgotSecretQuestionLinkComponent implements OnInit, OnDestroy {
  message = 'Forgot Secret Question?';

  constructor(
    private regService: RegistrationService,
    private userService: UserService,
    private util: UtilitiesService
    ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  getSecretQuestion() {
    console.log('get secret question');
    this.message = 'sending secret question...';
    const userid = this.userService.getUserDetails().userId;
    this.regService.ForgotSecretAnswer(userid)
    .pipe(untilComponentDestroyed(this)).subscribe(
      (res: any) => {
        console.log(res);
        if (res.responseCode === '00') {
          this.message = 'Secret question has been sent to your email';
        } else {
          this.message = this.util.handleResponseError(res) + 'Try again';
        }
        this.resetMessage();
      },
      (err) => {
        this.message = err;
        this.resetMessage();
      }
    );
  }

  resetMessage() {
    setTimeout(() => {
      this.message = 'Forgot Secret Question?';
    }, 5000);
  }

}
