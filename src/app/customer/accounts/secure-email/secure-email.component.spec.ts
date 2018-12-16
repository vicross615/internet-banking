import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureEmailComponent } from './secure-email.component';

describe('SecureEmailComponent', () => {
  let component: SecureEmailComponent;
  let fixture: ComponentFixture<SecureEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
