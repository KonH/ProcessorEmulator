var CommandHelper = (function () {
    function CommandHelper(model) {
        this.handlers = new Map();
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
        this.handlers.set(key, handler);
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
        if (this.handlers.has(header)) {
            return this.handlers.get(header);
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
