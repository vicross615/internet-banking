import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenConfirmationModalComponent } from './token-confirmation-modal.component';

describe('TokenConfirmationModalComponent', () => {
  let component: TokenConfirmationModalComponent;
  let fixture: ComponentFixture<TokenConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TokenConfirmationModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
