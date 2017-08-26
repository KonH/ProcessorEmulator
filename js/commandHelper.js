var CommandHelper = (function () {
    function CommandHelper(model) {
        this.handlersByHeader = new Map();
        this.handlersByName = new Map();
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
            new JumpEqualHandler(),
            new LoadHandler(),
            new SaveHandler(),
            new LoadByRegHandler(),
            new SaveByRegHandler(),
            new AddHandler()
        ]);
    }
    CommandHelper.prototype.addHandlers = function (handlers) {
        var _this = this;
        handlers.forEach(function (handler) { return _this.addHandler(handler); });
    };
    CommandHelper.prototype.addHandler = function (handler) {
        this.handlersByHeader.set(handler.header, handler);
        this.handlersByName.set(handler.name.toLowerCase(), handler);
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
    CommandHelper.prototype.findHandler = function (key, collection) {
        if (collection.has(key)) {
            return collection.get(key);
        }
        return null;
    };
    CommandHelper.prototype.findHandlerByHeader = function (header) {
        return this.findHandler(header, this.handlersByHeader);
    };
    CommandHelper.prototype.findHandlerByName = function (name) {
        return this.findHandler(name.toLowerCase(), this.handlersByName);
    };
    CommandHelper.prototype.execCommand = function (command) {
        var header = command.header;
        var handler = this.findHandlerByHeader(header.toNum());
        if (handler != null) {
            this.prepare(command, handler.name, handler.shortArgs, handler.wideArgs);
            handler.exec(command, model);
        }
    };
    return CommandHelper;
}());
