import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalTypeaheadComponent } from './universal-typeahead.component';

describe('UniversalTypeaheadComponent', () => {
  let component: UniversalTypeaheadComponent;
  let fixture: ComponentFixture<UniversalTypeaheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversalTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
