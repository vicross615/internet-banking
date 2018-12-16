import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximumAdvanceComponent } from './maximum-advance.component';

describe('MaximumAdvanceComponent', () => {
  let component: MaximumAdvanceComponent;
  let fixture: ComponentFixture<MaximumAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaximumAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaximumAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
