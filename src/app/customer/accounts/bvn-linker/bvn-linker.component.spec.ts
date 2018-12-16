import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BvnLinkerComponent } from './bvn-linker.component';

describe('BvnLinkerComponent', () => {
  let component: BvnLinkerComponent;
  let fixture: ComponentFixture<BvnLinkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BvnLinkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BvnLinkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
