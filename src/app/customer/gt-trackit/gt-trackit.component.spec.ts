import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtTrackitComponent } from './gt-trackit.component';

describe('GtTrackitComponent', () => {
  let component: GtTrackitComponent;
  let fixture: ComponentFixture<GtTrackitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtTrackitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtTrackitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
