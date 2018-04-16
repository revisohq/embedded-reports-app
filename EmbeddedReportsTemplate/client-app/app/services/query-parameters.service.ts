import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class QueryParametersService {

  private _urlSearchParams: URLSearchParams;
  constructor() { }

  getParams(): URLSearchParams {
    return this._urlSearchParams;
  }

  setParams(urlSearchParams: URLSearchParams) {
    this._urlSearchParams = urlSearchParams;
  }

}
