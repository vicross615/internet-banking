import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryCardsComponent } from './payment-history-cards.component';

describe('PaymentHistoryCardsComponent', () => {
  let component: PaymentHistoryCardsComponent;
  let fixture: ComponentFixture<PaymentHistoryCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHistoryCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHistoryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
