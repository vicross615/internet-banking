import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { Cards } from './cards.model';
import { CardsService } from './cards.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../_customer-service/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
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
export class CardsComponent implements OnInit, OnDestroy {
  public cards: Array<Cards>;
  public selectedCard: Cards;
  errorMessage: string;
  more = false;
  clicked = false;

  constructor(
    private fb: FormBuilder,
    private cardsService: CardsService,
    public customerService: CustomerService
  ) {
    // this.cardsService.cards$.subscribe(
    //   cards => this.cards = cards
    // );
    // this.cardsService.selectedCard$.subscribe(.pipe(untilComponentDestroyed(this))

    //   s => {
    //     this.selectedCard = s;
    //     console.log('edited PAN' + this.selectedCard.editedPan);
    //   }
    // );
    // this.selectedCard.editedPan = (this.selectedCard) ? this.selectedCard.pan.match(/.{1,4}/g).join('   ') : '';
    this.initializeCards();

  }

  ngOnInit() {


  //   const count = 0;
  //   if (!localStorage.getItem('reloaded')) {
  //     location.reload(true);
  //     localStorage.setItem('reloaded', 'true');
  // }
  }

  ngOnDestroy(): void {
  //  localStorage.removeItem('reloaded');
  }

  toggleMenu() {
    this.more = !this.more;
  }

  onSubmit(formValues) {
    console.log(formValues);
  }

  initializeCards() {
    this.cardsService.cards$.pipe(untilComponentDestroyed(this))
    .subscribe(
      cards => {
        this.cards = cards;
        console.log('cards: ' + JSON.stringify(this.cards));
      }
    );

    this.cardsService.selectedCard$.pipe(untilComponentDestroyed(this))
    .subscribe(
      s => {
        this.selectedCard = s;
      }
    );
    this.cardsService.cardsError$.pipe(untilComponentDestroyed(this))
    .subscribe(message => this.errorMessage = message);
  }

}
