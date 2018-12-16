import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillersListComponent } from './billers-list.component';

describe('BillersListComponent', () => {
  let component: BillersListComponent;
  let fixture: ComponentFixture<BillersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
