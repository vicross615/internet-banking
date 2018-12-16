import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinRetrievalComponent } from './pin-retrieval.component';

describe('PinRetrievalComponent', () => {
  let component: PinRetrievalComponent;
  let fixture: ComponentFixture<PinRetrievalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinRetrievalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinRetrievalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
