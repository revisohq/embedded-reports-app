import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[report-host]'
})
export class ReportHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
