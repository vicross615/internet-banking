import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentTransfersComponent } from './frequent-transfers.component';

describe('FrequentTransfersComponent', () => {
  let component: FrequentTransfersComponent;
  let fixture: ComponentFixture<FrequentTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequentTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
