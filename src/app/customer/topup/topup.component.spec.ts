import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupComponent } from './topup.component';

describe('TopupComponent', () => {
  let component: TopupComponent;
  let fixture: ComponentFixture<TopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
