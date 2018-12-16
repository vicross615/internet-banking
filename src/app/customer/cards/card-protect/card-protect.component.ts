import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { transition, trigger, animate, style } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CardsService } from '../cards.service';
import { UtilitiesService } from '../../../_services/utilities.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-card-protect',
  templateUrl: './card-protect.component.html',
  styleUrls: ['./card-protect.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ],
})
export class CardProtectComponent implements OnInit, AfterViewInit, OnDestroy {
  cardProtectForm: FormGroup;
  cardProtectMessage: any;
  status: any;
  isToken = false;
  channels = ['All', 'Web', 'POS', 'Local', 'International'];
  reqBody: any = {};
  errorMessage: any;
  successMessage: any;

  constructor(
    private fb: FormBuilder,
    private cardsService: CardsService,
    private utils: UtilitiesService
  ) {
    this.getStatus();
    this.cardsService.cardProtectStatus$.pipe(untilComponentDestroyed(this))
    .subscribe(status => {
      this.status = status;
      console.log(this.status);
      this.cardProtectForm.controls['all'].setValue(this.status.all.toString());
      this.cardProtectForm.controls['web'].setValue(this.status.web.toString());
      this.cardProtectForm.controls['pos'].setValue(this.status.atmPos.toString());
      this.cardProtectForm.controls['local'].setValue(this.status.local.toString());
      this.cardProtectForm.controls['international'].setValue(this.status.international.toString());
    });
   }

  ngOnInit() {
    if (this.status !== {}) {
      this.createCardProtectForm();
    }

  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {

  }

  getStatus() {
    this.cardsService.getCardProtectStatusData();
  }

  createCardProtectForm() {
    this.cardProtectForm = this.fb.group({
      'all': '',
      'web': '',
      'pos': '',
      'local': '',
      'international': '',
      'token': [ '', Validators.required],
    });
  }

  updateChannelStatus() {
    this.reqBody.token = this.cardProtectForm.controls['token'].value;
    this.cardsService.enableDisableChannel(this.reqBody)
    .pipe(untilComponentDestroyed(this))
    .subscribe(
      res => {
        console.log(res);
        if (res.responseCode === '00') {
          this.cardsService.getCardProtectStatusData();
          this.successMessage = `Your card protection status has been updated for ${this.reqBody.channel}.`;
          this.isToken = false;
        } else {
          this.errorMessage = this.utils.handleResponseError(res);
          this.isToken = true;
        }
        this.cardProtectForm.controls['token'].reset();
      }
    );
  }

  showToken(channel, status) {
    this.reqBody.channel = channel;
    this.reqBody.status = status;
    this.isToken = true;
    console.log(this.reqBody);
  }

}
