import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedFundsComponent } from './blocked-funds.component';

describe('BlockedFundsComponent', () => {
  let component: BlockedFundsComponent;
  let fixture: ComponentFixture<BlockedFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockedFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
