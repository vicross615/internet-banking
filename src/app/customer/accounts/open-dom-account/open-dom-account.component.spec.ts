import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDomAccountComponent } from './open-dom-account.component';

describe('OpenDomAccountComponent', () => {
  let component: OpenDomAccountComponent;
  let fixture: ComponentFixture<OpenDomAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDomAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDomAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
