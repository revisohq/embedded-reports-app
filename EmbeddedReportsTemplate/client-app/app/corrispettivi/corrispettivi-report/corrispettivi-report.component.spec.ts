import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrispettiviReportComponent } from './corrispettivi-report.component';

describe('CorrispettiviReportComponent', () => {
  let component: CorrispettiviReportComponent;
  let fixture: ComponentFixture<CorrispettiviReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrispettiviReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrispettiviReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
