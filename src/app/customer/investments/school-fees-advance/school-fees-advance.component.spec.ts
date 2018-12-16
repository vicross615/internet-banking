import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolFeesAdvanceComponent } from './school-fees-advance.component';

describe('SchoolFeesAdvanceComponent', () => {
  let component: SchoolFeesAdvanceComponent;
  let fixture: ComponentFixture<SchoolFeesAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolFeesAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolFeesAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
