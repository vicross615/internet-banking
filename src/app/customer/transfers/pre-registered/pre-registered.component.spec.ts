import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegisteredComponent } from './pre-registered.component';

describe('PreRegisteredComponent', () => {
  let component: PreRegisteredComponent;
  let fixture: ComponentFixture<PreRegisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreRegisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
