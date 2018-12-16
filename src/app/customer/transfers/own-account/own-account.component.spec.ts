import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnAccountComponent } from './own-account.component';

describe('OwnAccountComponent', () => {
  let component: OwnAccountComponent;
  let fixture: ComponentFixture<OwnAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
