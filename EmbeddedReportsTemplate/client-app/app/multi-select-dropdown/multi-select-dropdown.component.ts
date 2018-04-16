import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { IMultiSelectItem } from '../shared/multi-select-item';

@Component({
  selector: 'multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css']
})
export class MultiSelectDropdownComponent implements OnChanges {
  @Input() list: Array<IMultiSelectItem>;
  @Input() loading: boolean;

  @Output() shareCheckedList = new EventEmitter();
  @Output() shareIndividualCheckedList = new EventEmitter();

  showDropDown: boolean;
  checkedList: Array<IMultiSelectItem>;
  currentSelected: IMultiSelectItem;

  constructor() {
    this.checkedList = [];
  }

  getSelectedValue(event: any, selectedItem: IMultiSelectItem) {
    if (selectedItem.selected) {
      this.checkedList.push(selectedItem.value);
    } else {
      if(this.checkedList.length == 1){
        selectedItem.selected = true;
        this.showDropDown = false;
      }else {
        var index = this.checkedList.indexOf(selectedItem.value);
        this.checkedList.splice(index, 1);
      }
    }

    this.currentSelected = selectedItem;

    //share checked list
    this.shareCheckedlist();

    //share individual selected item
    this.shareIndividualStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkedList = [];

    let currentValue = <Array<IMultiSelectItem>> changes.list.currentValue;
    let items = currentValue.slice(0);

    if(items.length){
      items.forEach(item => {
        if(item.selected){
          this.checkedList.push(item.value);
        }
      })
    }
  }

  shareCheckedlist() {
    this.shareCheckedList.emit(this.checkedList);
  }

  shareIndividualStatus() {
    this.shareIndividualCheckedList.emit(this.currentSelected);
  }

  isCheckListEmpty(): boolean {
    return this.checkedList == null || this.checkedList.length == 0;
  }

  isCheckListFull(): boolean {
    return !this.isCheckListEmpty();
  }
}
