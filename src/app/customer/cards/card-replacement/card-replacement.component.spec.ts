import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReplacementComponent } from './card-replacement.component';

describe('CardReplacementComponent', () => {
  let component: CardReplacementComponent;
  let fixture: ComponentFixture<CardReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
