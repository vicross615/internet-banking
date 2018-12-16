import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbankNotificationsComponent } from './ibank-notifications.component';

describe('IbankNotificationsComponent', () => {
  let component: IbankNotificationsComponent;
  let fixture: ComponentFixture<IbankNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbankNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbankNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
