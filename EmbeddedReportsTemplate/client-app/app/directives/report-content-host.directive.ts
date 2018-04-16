import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[report-content-host]'
})
export class ReportContentHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
