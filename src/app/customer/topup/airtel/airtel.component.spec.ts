import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelComponent } from './airtel.component';

describe('AirtelComponent', () => {
  let component: AirtelComponent;
  let fixture: ComponentFixture<AirtelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
