import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FxAccountsTypeaheadComponent } from './fxaccounts-typeahead.component';

describe('AccountsTypeaheadComponent', () => {
  let component: FxAccountsTypeaheadComponent;
  let fixture: ComponentFixture<FxAccountsTypeaheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FxAccountsTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FxAccountsTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
