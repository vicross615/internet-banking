import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NineMobileComponent } from './nine-mobile.component';

describe('NineMobileComponent', () => {
  let component: NineMobileComponent;
  let fixture: ComponentFixture<NineMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NineMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NineMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
