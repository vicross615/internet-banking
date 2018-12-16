import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftInTransitComponent } from './draft-in-transit.component';

describe('DraftInTransitComponent', () => {
  let component: DraftInTransitComponent;
  let fixture: ComponentFixture<DraftInTransitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftInTransitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftInTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
