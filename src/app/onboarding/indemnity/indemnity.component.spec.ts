import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndemnityComponent } from './indemnity.component';

describe('IndemnityComponent', () => {
  let component: IndemnityComponent;
  let fixture: ComponentFixture<IndemnityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndemnityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndemnityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
