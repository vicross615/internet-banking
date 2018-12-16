import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeAppointmentComponent } from './sme-appointment.component';

describe('SmeAppointmentComponent', () => {
  let component: SmeAppointmentComponent;
  let fixture: ComponentFixture<SmeAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
