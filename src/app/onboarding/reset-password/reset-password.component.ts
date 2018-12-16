import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PasswordresetService} from '../../customer/settings/password-reset/passwordreset.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'gtibank-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
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
export class ResetPasswordComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
