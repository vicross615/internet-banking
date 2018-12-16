import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IReferComponent } from './i-refer.component';

describe('IReferComponent', () => {
  let component: IReferComponent;
  let fixture: ComponentFixture<IReferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IReferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IReferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
