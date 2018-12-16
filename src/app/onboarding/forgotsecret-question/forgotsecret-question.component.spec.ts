import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotsecretQuestionComponent } from './forgotsecret-question.component';

describe('ForgotsecretQuestionComponent', () => {
  let component: ForgotsecretQuestionComponent;
  let fixture: ComponentFixture<ForgotsecretQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotsecretQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotsecretQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
