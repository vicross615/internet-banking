import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TopupComponent implements OnInit {
  requestTypeIs = 0; // Defaults to Airtime Purchase, 1 for Data Purchase
  constructor(private router: Router) {}
  async ngOnInit() {}
  // FOR YOU: TO REDIRECT USER
  redirect(url) {
    this.router.navigate([url]);
  }
  // To Dynamically display logo
  detectProductType(product: any, hint): Boolean {
    const state = product.includes(hint);
    return state;
  }
  // form toggle.
  set requestType(value: number) {
    this.requestTypeIs = value;
  }
}
