import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimalistTokenModalComponent } from './minimalist-token-modal.component';

describe('MinimalistTokenModalComponent', () => {
  let component: MinimalistTokenModalComponent;
  let fixture: ComponentFixture<MinimalistTokenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimalistTokenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimalistTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
