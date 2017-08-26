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
        model.setCommonRegister(cmd.args[0], BitSet.empty(Setup.regSize));
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
        var val = model.getCommonRegister(cmd.args[0]);
        var newVal = val.setValue(val.toNum() + 1);
        model.setCommonRegister(cmd.args[0], newVal);
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
        var value = model.getCommonRegister(cmd.args[0]);
        model.setCommonRegister(cmd.args[1], value);
    };
    return MoveHandler;
}(HandlerBase));
var ResetAccHandler = (function (_super) {
    __extends(ResetAccHandler, _super);
    function ResetAccHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 4;
        _this.name = "RSTA";
        _this.description = "a = 0";
        return _this;
    }
    ResetAccHandler.prototype.exec = function (cmd, model) {
        model.setAccumRegister(BitSet.empty(Setup.regSize));
    };
    return ResetAccHandler;
}(HandlerBase));
var IncAccHandler = (function (_super) {
    __extends(IncAccHandler, _super);
    function IncAccHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 5;
        _this.name = "INCA";
        _this.description = "a++";
        return _this;
    }
    IncAccHandler.prototype.exec = function (cmd, model) {
        var val = model.getAccumRegister();
        var newVal = val.setValue(val.toNum() + 1);
        model.setAccumRegister(newVal);
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
        _this.description = "a = r[x]";
        return _this;
    }
    MoveAccHandler.prototype.exec = function (cmd, model) {
        var value = model.getCommonRegister(cmd.args[0]);
        model.setAccumRegister(value);
    };
    return MoveAccHandler;
}(HandlerBase));
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
        var condition = model.getCommonRegister(cmd.args[0]).toNum() == 0;
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
        var condition = model.getCommonRegister(cmd.args[0]).toNum() == model.getCommonRegister(cmd.args[1]).toNum();
        if (condition) {
            model.setCounter(cmd.args[2]);
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
        var len = Setup.regSize;
        var result = model.getMemory(addr, len);
        model.setCommonRegister(cmd.args[0], result);
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
        var content = model.getCommonRegister(cmd.args[0]);
        model.setMemory(addr, content);
    };
    return SaveHandler;
}(HandlerBase));
var LoadByRegHandler = (function (_super) {
    __extends(LoadByRegHandler, _super);
    function LoadByRegHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 12;
        _this.name = "LDR";
        _this.shortArgs = 2;
        _this.description = "load mem from r[x] to r[y]";
        return _this;
    }
    LoadByRegHandler.prototype.exec = function (cmd, model) {
        var addr = cmd.args[1];
        var len = Setup.regSize;
        var result = model.getMemory(addr, len);
        model.setCommonRegister(cmd.args[0], result);
    };
    return LoadByRegHandler;
}(HandlerBase));
var SaveByRegHandler = (function (_super) {
    __extends(SaveByRegHandler, _super);
    function SaveByRegHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 13;
        _this.name = "SVR";
        _this.shortArgs = 2;
        _this.description = "save r[x] to mem at r[y]";
        return _this;
    }
    SaveByRegHandler.prototype.exec = function (cmd, model) {
        var addr = model.getCommonRegister(cmd.args[1]);
        var content = model.getCommonRegister(cmd.args[0]);
        model.setMemory(addr, content);
    };
    return SaveByRegHandler;
}(HandlerBase));
var AddHandler = (function (_super) {
    __extends(AddHandler, _super);
    function AddHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 15;
        _this.name = "ADD";
        _this.shortArgs = 2;
        _this.description = "add r[x] to r[y]";
        return _this;
    }
    AddHandler.prototype.exec = function (cmd, model) {
        var sendValue = model.getCommonRegister(cmd.args[0]);
        var recValue = model.getCommonRegister(cmd.args[1]);
        var newVal = BitSet.fromNum(sendValue.toNum() + recValue.toNum(), Setup.regSize);
        model.setCommonRegister(cmd.args[1], newVal);
    };
    return AddHandler;
}(HandlerBase));
var PutHandler = (function (_super) {
    __extends(PutHandler, _super);
    function PutHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 15;
        _this.name = "PUT";
        _this.shortArgs = 1;
        _this.wideArgs = 1;
        _this.description = "put y to r[x]";
        return _this;
    }
    PutHandler.prototype.exec = function (cmd, model) {
        model.setCommonRegister(cmd.args[0], cmd.args[1]);
    };
    return PutHandler;
}(HandlerBase));
var AddAccHandler = (function (_super) {
    __extends(AddAccHandler, _super);
    function AddAccHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 16;
        _this.name = "ADDA";
        _this.shortArgs = 1;
        _this.description = "add r[x] to a";
        return _this;
    }
    AddAccHandler.prototype.exec = function (cmd, model) {
        var newVal = BitSet.fromNum(model.getAccumRegister().toNum() +
            model.getCommonRegister(cmd.args[0]).toNum(), Setup.regSize);
        model.setAccumRegister(newVal);
    };
    return AddAccHandler;
}(HandlerBase));
var AccMoveHandler = (function (_super) {
    __extends(AccMoveHandler, _super);
    function AccMoveHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 17;
        _this.name = "AMOV";
        _this.shortArgs = 1;
        _this.description = "r[x] = a";
        return _this;
    }
    AccMoveHandler.prototype.exec = function (cmd, model) {
        var value = model.getAccumRegister();
        model.setCommonRegister(cmd.args[0], value);
    };
    return AccMoveHandler;
}(HandlerBase));
var LoadByAccRegHandler = (function (_super) {
    __extends(LoadByAccRegHandler, _super);
    function LoadByAccRegHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 18;
        _this.name = "LDRA";
        _this.shortArgs = 1;
        _this.description = "load mem from a to r[x]";
        return _this;
    }
    LoadByAccRegHandler.prototype.exec = function (cmd, model) {
        var addr = model.getAccumRegister();
        var len = Setup.regSize;
        var result = model.getMemory(addr, len);
        model.setCommonRegister(cmd.args[0], result);
    };
    return LoadByAccRegHandler;
}(HandlerBase));
var SaveByAccRegHandler = (function (_super) {
    __extends(SaveByAccRegHandler, _super);
    function SaveByAccRegHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 19;
        _this.name = "SVRA";
        _this.shortArgs = 1;
        _this.description = "save r[x] to mem at a";
        return _this;
    }
    SaveByAccRegHandler.prototype.exec = function (cmd, model) {
        var addr = model.getAccumRegister();
        var content = model.getCommonRegister(cmd.args[0]);
        model.setMemory(addr, content);
    };
    return SaveByAccRegHandler;
}(HandlerBase));
