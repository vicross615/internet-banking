import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTransferComponent } from './quick-transfer.component';

describe('QuickTransferComponent', () => {
  let component: QuickTransferComponent;
  let fixture: ComponentFixture<QuickTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
