import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-unexpected-error',
  templateUrl: './unexpected-error.component.html',
  styleUrls: ['./unexpected-error.component.css']
})
export class UnexpectedErrorComponent implements OnInit {

  @Input() error: boolean;

  constructor() { }

  ngOnInit() {
  }

}
