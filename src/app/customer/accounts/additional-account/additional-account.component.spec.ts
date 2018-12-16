import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalAccountComponent } from './additional-account.component';

describe('AdditionalAccountComponent', () => {
  let component: AdditionalAccountComponent;
  let fixture: ComponentFixture<AdditionalAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
