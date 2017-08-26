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
var ResetHandler = (function (_super) {
    __extends(ResetHandler, _super);
    function ResetHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 1;
        _this.name = "RST";
        _this.shortArgs = 1;
        return _this;
    }
    ResetHandler.prototype.exec = function (cmd, model) {
        var idx = this.getCommonRegIdx(cmd.args[0]);
        model.setRegister(idx, 0);
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
        return _this;
    }
    IncHandler.prototype.exec = function (cmd, model) {
        var index = this.getCommonRegIdx(cmd.args[0]);
        var val = model.registers[index];
        model.setRegister(index, ++val);
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
        return _this;
    }
    MoveHandler.prototype.exec = function (cmd, model) {
        var fromIdx = this.getCommonRegIdx(cmd.args[0]);
        var toIdx = this.getCommonRegIdx(cmd.args[1]);
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
        return _this;
    }
    ResetAccHandler.prototype.exec = function (cmd, model) {
        model.setRegister(HandlerBase.accRegIdx, 0);
    };
    return ResetAccHandler;
}(HandlerBase));
var IncAccHandler = (function (_super) {
    __extends(IncAccHandler, _super);
    function IncAccHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.header = 5;
        _this.name = "INCA";
        return _this;
    }
    IncAccHandler.prototype.exec = function (cmd, model) {
        var idx = HandlerBase.accRegIdx;
        var val = model.registers[idx];
        model.setRegister(idx, ++val);
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
        return _this;
    }
    MoveAccHandler.prototype.exec = function (cmd, model) {
        var fromIdx = this.getCommonRegIdx(cmd.args[0]);
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
        return _this;
    }
    JumpZeroHandler.prototype.exec = function (cmd, model) {
        var idx = this.getCommonRegIdx(cmd.args[0]);
        var condition = model.registers[idx] == 0;
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
        return _this;
    }
    JumpEqualHandler.prototype.exec = function (cmd, model) {
        var leftIdx = this.getCommonRegIdx(cmd.args[0]);
        var rightIdx = this.getCommonRegIdx(cmd.args[0]);
        var registers = model.registers;
        var condition = registers[leftIdx] == registers[rightIdx];
        if (condition) {
            model.setCounter(cmd.args[0]);
        }
    };
    return JumpEqualHandler;
}(HandlerBase));
var CommandHelper = (function () {
    function CommandHelper(model) {
        this.commands = new Map();
        this.model = model;
        this.addHandlers([
            new ResetHandler(),
            new IncHandler(),
            new MoveHandler(),
            new ResetAccHandler(),
            new IncAccHandler(),
            new MoveAccHandler(),
            new JumpHandler(),
            new JumpZeroHandler(),
            new JumpEqualHandler()
        ]);
    }
    CommandHelper.prototype.addHandlers = function (handlers) {
        var _this = this;
        handlers.forEach(function (handler) { return _this.addHandler(handler); });
    };
    CommandHelper.prototype.addHandler = function (handler) {
        var key = handler.header;
        this.commands.set(key, handler);
    };
    CommandHelper.prototype.loadCommandDataWide = function (command, count) {
        var data = this.model.readBusData(count * Command.wideArgSize);
        command.loadWideArgs(data, count);
    };
    CommandHelper.prototype.loadCommandDataShort = function (command, count) {
        var data = this.model.readBusData(count * Command.shortArgSize);
        command.loadShortArgs(data, count);
    };
    CommandHelper.prototype.prepare = function (command, name, shortArgs, wideArgs) {
        Logger.write("commandHelper", "prepareCommand: " + name + ", short: " + shortArgs + ", wide: " + wideArgs);
        command.name = name;
        if (shortArgs > 0) {
            this.loadCommandDataShort(command, shortArgs);
        }
        if (wideArgs > 0) {
            this.loadCommandDataWide(command, wideArgs);
        }
    };
    CommandHelper.prototype.findHandler = function (header) {
        if (this.commands.has(header)) {
            return this.commands.get(header);
        }
        return null;
    };
    CommandHelper.prototype.execCommand = function (command) {
        var header = command.header;
        var handler = this.findHandler(header);
        if (handler != null) {
            this.prepare(command, handler.name, handler.shortArgs, handler.wideArgs);
            handler.exec(command, model);
        }
    };
    return CommandHelper;
}());
