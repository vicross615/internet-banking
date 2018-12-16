import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualCardRequestComponent } from './virtual-card-request.component';

describe('VirtualCardRequestComponent', () => {
  let component: VirtualCardRequestComponent;
  let fixture: ComponentFixture<VirtualCardRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualCardRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualCardRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
