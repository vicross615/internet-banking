import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentTopupCompComponent } from './frequent-topup-comp.component';

describe('FrequentTopupCompComponent', () => {
  let component: FrequentTopupCompComponent;
  let fixture: ComponentFixture<FrequentTopupCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequentTopupCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentTopupCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
