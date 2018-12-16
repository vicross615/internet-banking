import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherBanksComponent } from './other-banks.component';

describe('OtherBanksComponent', () => {
  let component: OtherBanksComponent;
  let fixture: ComponentFixture<OtherBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
