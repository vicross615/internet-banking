import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateStatementComponent } from './generate-statement.component';

describe('GenerateStatementComponent', () => {
  let component: GenerateStatementComponent;
  let fixture: ComponentFixture<GenerateStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
