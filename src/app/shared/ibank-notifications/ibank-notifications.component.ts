import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ibank-notifications',
  templateUrl: './ibank-notifications.component.html',
  styleUrls: ['./ibank-notifications.component.scss'],
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
    ]),
    trigger('slideUpDown', [
      state('in', style({height: '*'})),
      transition('* => void', [
        style({height: '*'}),
        animate('300ms ease-in', style({height: 0}))
      ]),
      transition('void => *', [
        style({height: 0}),
        animate('300ms ease-in', style({height: '*'}))
      ]),
    ])
  ]
})
export class IbankNotificationsComponent implements OnInit {
  @Input() notification: IbankNotifications;
  @Output() vissibilityEvent = new EventEmitter<boolean>();
  notificationIcon: string;

  constructor() { }

  ngOnInit() {

  }

  clearNotification() {
    setTimeout(() => {
      this.notification = null;
      this.vissibilityEvent.emit(true);
    }, 300);
  }

}

export class IbankNotifications {
  constructor(
    public type?: string,
    public title?: string,
    public message?: string,
) {}
}
