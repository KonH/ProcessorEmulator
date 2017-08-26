var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HandlerBase = (function () {
    function HandlerBase() {
        this.shortArgs = 0;
        this.wideArgs = 0;
    }
    HandlerBase.prototype.getCommonRegIdx = function (index) {
        return index + 1;
    };
    HandlerBase.accRegIdx = 0;
    return HandlerBase;
}());
var MoveHandlerBase = (function (_super) {
    __extends(MoveHandlerBase, _super);
    function MoveHandlerBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoveHandlerBase.prototype.commonMove = function (model, fromIdx, toIdx) {
        var fromValue = model.registers[fromIdx];
        model.setRegister(toIdx, fromValue);
    };
    return MoveHandlerBase;
}(HandlerBase));
