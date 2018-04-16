import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnexpectedErrorComponent } from './unexpected-error.component';

describe('UnexpectedErrorComponent', () => {
  let component: UnexpectedErrorComponent;
  let fixture: ComponentFixture<UnexpectedErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnexpectedErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnexpectedErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
