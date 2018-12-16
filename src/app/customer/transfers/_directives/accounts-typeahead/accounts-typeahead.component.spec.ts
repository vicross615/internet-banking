import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsTypeaheadComponent } from './accounts-typeahead.component';

describe('AccountsTypeaheadComponent', () => {
  let component: AccountsTypeaheadComponent;
  let fixture: ComponentFixture<AccountsTypeaheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
