import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtSweepComponent } from './gt-sweep.component';

describe('GtSweepComponent', () => {
  let component: GtSweepComponent;
  let fixture: ComponentFixture<GtSweepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtSweepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtSweepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
