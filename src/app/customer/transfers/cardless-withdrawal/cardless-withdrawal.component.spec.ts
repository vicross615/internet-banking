import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardlessWithdrawalComponent } from './cardless-withdrawal.component';

describe('CardlessWithdrawalComponent', () => {
  let component: CardlessWithdrawalComponent;
  let fixture: ComponentFixture<CardlessWithdrawalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardlessWithdrawalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardlessWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
