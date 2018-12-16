import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProtectComponent } from './card-protect.component';

describe('CardProtectComponent', () => {
  let component: CardProtectComponent;
  let fixture: ComponentFixture<CardProtectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProtectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProtectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
