import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsPaymentComponent } from './bills-payment.component';

describe('BillsPaymentComponent', () => {
  let component: BillsPaymentComponent;
  let fixture: ComponentFixture<BillsPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
