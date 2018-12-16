import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtbFxComponent } from './gtb-fx.component';

describe('GtbFxComponent', () => {
  let component: GtbFxComponent;
  let fixture: ComponentFixture<GtbFxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtbFxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtbFxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
