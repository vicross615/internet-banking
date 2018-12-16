import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHotlistingComponent } from './card-hotlisting.component';

describe('CardHotlistingComponent', () => {
  let component: CardHotlistingComponent;
  let fixture: ComponentFixture<CardHotlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardHotlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHotlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
