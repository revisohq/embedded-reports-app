"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MultiSelectDropdownComponent = /** @class */ (function () {
    function MultiSelectDropdownComponent() {
        this.shareCheckedList = new core_1.EventEmitter();
        this.shareIndividualCheckedList = new core_1.EventEmitter();
        this.checkedList = [];
    }
    MultiSelectDropdownComponent.prototype.getSelectedValue = function (event, selectedItem) {
        if (selectedItem.selected) {
            this.checkedList.push(selectedItem.value);
        }
        else {
            if (this.checkedList.length == 1) {
                selectedItem.selected = true;
                this.showDropDown = false;
            }
            else {
                var index = this.checkedList.indexOf(selectedItem.value);
                this.checkedList.splice(index, 1);
            }
        }
        this.currentSelected = selectedItem;
        //share checked list
        this.shareCheckedlist();
        //share individual selected item
        this.shareIndividualStatus();
    };
    MultiSelectDropdownComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.checkedList = [];
        var currentValue = changes.list.currentValue;
        var items = currentValue.slice(0);
        if (items.length) {
            items.forEach(function (item) {
                if (item.selected) {
                    _this.checkedList.push(item.value);
                }
            });
        }
    };
    MultiSelectDropdownComponent.prototype.shareCheckedlist = function () {
        this.shareCheckedList.emit(this.checkedList);
    };
    MultiSelectDropdownComponent.prototype.shareIndividualStatus = function () {
        this.shareIndividualCheckedList.emit(this.currentSelected);
    };
    MultiSelectDropdownComponent.prototype.isCheckListEmpty = function () {
        return this.checkedList == null || this.checkedList.length == 0;
    };
    MultiSelectDropdownComponent.prototype.isCheckListFull = function () {
        return !this.isCheckListEmpty();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], MultiSelectDropdownComponent.prototype, "list", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], MultiSelectDropdownComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MultiSelectDropdownComponent.prototype, "shareCheckedList", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MultiSelectDropdownComponent.prototype, "shareIndividualCheckedList", void 0);
    MultiSelectDropdownComponent = __decorate([
        core_1.Component({
            selector: 'multi-select-dropdown',
            templateUrl: './multi-select-dropdown.component.html',
            styleUrls: ['./multi-select-dropdown.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], MultiSelectDropdownComponent);
    return MultiSelectDropdownComponent;
}());
exports.MultiSelectDropdownComponent = MultiSelectDropdownComponent;
//# sourceMappingURL=multi-select-dropdown.component.js.map