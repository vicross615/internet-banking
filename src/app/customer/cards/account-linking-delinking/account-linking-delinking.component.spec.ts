import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountLinkingDelinkingComponent } from './account-linking-delinking.component';

describe('AccountLinkingDelinkingComponent', () => {
  let component: AccountLinkingDelinkingComponent;
  let fixture: ComponentFixture<AccountLinkingDelinkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLinkingDelinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLinkingDelinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
