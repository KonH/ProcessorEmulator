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
var ResetHandler = (function (_super) {
    __extends(ResetHandler, _super);
    function ResetHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 1;
        _this.name = "RST";
        _this.shortArgs = 1;
        _this.description = "r[x] = 0";
        return _this;
    }
    ResetHandler.prototype.exec = function (cmd, model) {
        var idx = model.getCommonRegIdx(cmd.args[0]);
        model.setRegister(idx, BitSet.empty(ProcessorModel.regSize));
    };
    return ResetHandler;
}(HandlerBase));
var IncHandler = (function (_super) {
    __extends(IncHandler, _super);
    function IncHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 2;
        _this.name = "INC";
        _this.shortArgs = 1;
        _this.description = "r[x]++";
        return _this;
    }
    IncHandler.prototype.exec = function (cmd, model) {
        var index = model.getCommonRegIdx(cmd.args[0]);
        var val = model.registers[index];
        var newVal = val.setValue(val.toNum() + 1);
        model.setRegister(index, newVal);
    };
    return IncHandler;
}(HandlerBase));
var MoveHandler = (function (_super) {
    __extends(MoveHandler, _super);
    function MoveHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 3;
        _this.name = "MOV";
        _this.shortArgs = 2;
        _this.description = "r[y] = r[x]";
        return _this;
    }
    MoveHandler.prototype.exec = function (cmd, model) {
        var fromIdx = model.getCommonRegIdx(cmd.args[0]);
        var toIdx = model.getCommonRegIdx(cmd.args[1]);
        this.commonMove(model, fromIdx, toIdx);
    };
    return MoveHandler;
}(MoveHandlerBase));
var ResetAccHandler = (function (_super) {
    __extends(ResetAccHandler, _super);
    function ResetAccHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 4;
        _this.name = "RSTA";
        _this.description = "r[0] = 0";
        return _this;
    }
    ResetAccHandler.prototype.exec = function (cmd, model) {
        model.setRegister(HandlerBase.accRegIdx, BitSet.empty(ProcessorModel.regSize));
    };
    return ResetAccHandler;
}(HandlerBase));
var IncAccHandler = (function (_super) {
    __extends(IncAccHandler, _super);
    function IncAccHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 5;
        _this.name = "INCA";
        _this.description = "r[0]++";
        return _this;
    }
    IncAccHandler.prototype.exec = function (cmd, model) {
        var idx = HandlerBase.accRegIdx;
        var val = model.registers[idx];
        var newVal = val.setValue(val.toNum() + 1);
        model.setRegister(idx, newVal);
    };
    return IncAccHandler;
}(HandlerBase));
var MoveAccHandler = (function (_super) {
    __extends(MoveAccHandler, _super);
    function MoveAccHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 6;
        _this.name = "MOVA";
        _this.shortArgs = 1;
        _this.description = "r[0] = r[x]";
        return _this;
    }
    MoveAccHandler.prototype.exec = function (cmd, model) {
        var fromIdx = model.getCommonRegIdx(cmd.args[0]);
        this.commonMove(model, fromIdx, HandlerBase.accRegIdx);
    };
    return MoveAccHandler;
}(MoveHandlerBase));
var JumpHandler = (function (_super) {
    __extends(JumpHandler, _super);
    function JumpHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 7;
        _this.name = "JMP";
        _this.wideArgs = 1;
        _this.description = "go to x";
        return _this;
    }
    JumpHandler.prototype.exec = function (cmd, model) {
        model.setCounter(cmd.args[0]);
    };
    return JumpHandler;
}(HandlerBase));
var JumpZeroHandler = (function (_super) {
    __extends(JumpZeroHandler, _super);
    function JumpZeroHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 8;
        _this.name = "JMZ";
        _this.shortArgs = 1;
        _this.wideArgs = 1;
        _this.description = "go to y if r[x] == 0";
        return _this;
    }
    JumpZeroHandler.prototype.exec = function (cmd, model) {
        var idx = model.getCommonRegIdx(cmd.args[0]);
        var condition = model.registers[idx].toNum() == 0;
        if (condition) {
            model.setCounter(cmd.args[1]);
        }
    };
    return JumpZeroHandler;
}(HandlerBase));
var JumpEqualHandler = (function (_super) {
    __extends(JumpEqualHandler, _super);
    function JumpEqualHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 9;
        _this.name = "JME";
        _this.shortArgs = 2;
        _this.wideArgs = 1;
        _this.description = "go to z if r[x] == r[y]";
        return _this;
    }
    JumpEqualHandler.prototype.exec = function (cmd, model) {
        var leftIdx = model.getCommonRegIdx(cmd.args[0]);
        var rightIdx = model.getCommonRegIdx(cmd.args[0]);
        var registers = model.registers;
        var condition = registers[leftIdx] == registers[rightIdx];
        if (condition) {
            model.setCounter(cmd.args[0]);
        }
    };
    return JumpEqualHandler;
}(HandlerBase));
var LoadHandler = (function (_super) {
    __extends(LoadHandler, _super);
    function LoadHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 10;
        _this.name = "LD";
        _this.shortArgs = 1;
        _this.wideArgs = 1;
        _this.description = "load mem from y to r[x]";
        return _this;
    }
    LoadHandler.prototype.exec = function (cmd, model) {
        var addr = cmd.args[1];
        var len = ProcessorModel.regSize;
        var result = model.getMemory(addr, len);
        var regIdx = model.getCommonRegIdx(cmd.args[0]);
        model.setRegister(regIdx, result);
    };
    return LoadHandler;
}(HandlerBase));
var SaveHandler = (function (_super) {
    __extends(SaveHandler, _super);
    function SaveHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 11;
        _this.name = "SV";
        _this.shortArgs = 1;
        _this.wideArgs = 1;
        _this.description = "save r[x] to mem at y";
        return _this;
    }
    SaveHandler.prototype.exec = function (cmd, model) {
        var addr = cmd.args[1];
        var regIdx = model.getCommonRegIdx(cmd.args[0]);
        var content = model.registers[regIdx];
        model.setMemory(addr, content);
    };
    return SaveHandler;
}(HandlerBase));
