import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { IDialogResult } from '../shared/dialog-result';

@Injectable()
export class DialogOkCancelService<T> {

  // Observable
  private _dialogResultSource = new Subject<IDialogResult<T>>();

  // Observable string streams
  dialogResult$ = this._dialogResultSource.asObservable();

  constructor() { }

  // Service message commands
  dialogResult(result: IDialogResult<T>) {
    this._dialogResultSource.next(result);
  }

}
