import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GloComponent } from './glo.component';

describe('GloComponent', () => {
  let component: GloComponent;
  let fixture: ComponentFixture<GloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
