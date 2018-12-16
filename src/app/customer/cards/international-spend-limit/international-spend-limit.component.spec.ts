import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalSpendLimitComponent } from './international-spend-limit.component';

describe('InternationalSpendLimitComponent', () => {
  let component: InternationalSpendLimitComponent;
  let fixture: ComponentFixture<InternationalSpendLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternationalSpendLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalSpendLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
