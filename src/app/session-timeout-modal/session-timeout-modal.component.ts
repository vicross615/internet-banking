import { Component, OnInit, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { AuthService } from '../_services/auth.service';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
// <span class="f-20">01</span>min.<span class="f-20">50</span>secs

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'session-timeout-modal',
  template: `
    <app-modal-animation
    [modalID]="'sessionModal'" [modalClass]="'md-effect-12 text-center modal-sm'">
      <h4 class="py-3 f-w-400">Session Timeout</h4>
      <div>
        <p class="f-14">Your session is about to expire. Do you need more time?</p>

        <p class="f-14 f-w-500 mb-3">
          <span class="f-20">{{(countMinutes !==0 ? + countMinutes: '0')}} </span>
            minute{{(countMinutes > 1 ? 's' : ' ')}}
          <span class="f-20">{{countSeconds}}</span> secs
        </p>
        <p>
        </p>
        <button (click)="response(false)" class="btn  px-4 btn-danger btn-round btn-sm mx-2 waves-light" mdbRippleRadius>
        No</button>
        <button (click)="response(true)" class="btn  px-4 btn-success btn-round btn-sm mx-2 waves-light" mdbRippleRadius>
        Yes</button>
      </div>
      <button (click)="response(true)" aria-label="Close" class="md-close-btn"><i class="icofont icofont-ui-close"></i></button>
    </app-modal-animation>
  `
  // styleUrls: ['./session-timeout-modal.component.scss']
})
export class SessionTimeoutModalComponent implements OnInit, OnChanges {
  @Input() count: number;
  @Input() countMinutes: number;
  @Input() countSeconds: number;
  @Input() progressCount: number;
  @Input() idleState: string;
  @Output() resp = new EventEmitter();

  // sessionCount: number;
  // sessionCountMinutes: number;
  // sessionCountSeconds: number;
  // sessionProgressCount: number;
  // sessionTimeOut: boolean;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
      console.log('modal initialized');
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes.idleState;
    if (change) {
      console.log(`idle State changed from ${change.previousValue} to ${change.currentValue}`);
      if (change.currentValue === 'IDLE_TIME_IN_PROGRESS') {
        this.openModal('sessionModal');
      } else if (change.currentValue === 'TIMED_OUT') {
        console.log('close modal');
        this.closeModal('sessionModal');
      }
    }
    // if (changes.idleState.currentValue === false) {
    //   this.openModal('effect-12');
    // } else if (changes.timedOut.currentValue === true) {
    //   console.log('session timed out.. will logout user');
    // }

  }

  response(moreTime: any) {
    this.resp.emit(moreTime);
    console.log('USer Response: ' + moreTime);
    if (moreTime === true) {
      console.log('USer Response: ' + moreTime);
      this.closeModal('sessionModal');
    } else if (moreTime === false) {
      console.log('USer Response: ' + moreTime);
      this.router.navigate(['/onboarding/logout']);
    }
  }

  openModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeModal(event) {
    document.querySelector('#' + event).classList.remove('md-show');
    // ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

}
