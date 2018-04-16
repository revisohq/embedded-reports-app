import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrispettiviContentComponent } from './corrispettivi-content.component';

describe('CorrispettiviContentComponent', () => {
  let component: CorrispettiviContentComponent;
  let fixture: ComponentFixture<CorrispettiviContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrispettiviContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrispettiviContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
