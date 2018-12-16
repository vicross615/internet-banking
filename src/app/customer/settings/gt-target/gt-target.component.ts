import { Component, OnInit } from '@angular/core';
import { transition, animate, style, trigger } from '@angular/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gtibank-gt-target',
  templateUrl: './gt-target.component.html',
  styleUrls: ['./gt-target.component.scss'],
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
export class GtTargetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
