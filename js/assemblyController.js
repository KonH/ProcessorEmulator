var ArgHolder = (function () {
    function ArgHolder(rawValue, size) {
        this.rawValue = rawValue;
        this.size = size;
    }
    return ArgHolder;
}());
var AssemblyHolder = (function () {
    function AssemblyHolder(handler, args) {
        this.argHolders = [];
        this.handler = handler;
        var argIndex = 0;
        for (var i = 0; i < this.handler.shortArgs; i++) {
            this.argHolders.push(new ArgHolder(args[argIndex], Command.shortArgSize));
            argIndex++;
        }
        for (var i = 0; i < this.handler.wideArgs; i++) {
            this.argHolders.push(new ArgHolder(args[argIndex], Command.wideArgSize));
            argIndex++;
        }
    }
    AssemblyHolder.prototype.getHeader = function () {
        return this.handler.header;
    };
    return AssemblyHolder;
}());
var AssemblyController = (function () {
    function AssemblyController(assembly, machine, generate, helper) {
        var _this = this;
        this.assemblyInput = assembly;
        this.machineCodeInput = machine;
        this.generateButton = generate;
        this.generateButton.onclick = function () { return _this.generateMachineCode(_this.assemblyInput.value); };
        this.helper = helper;
    }
    AssemblyController.prototype.generateMachineCode = function (assemblyCode) {
        var lines = assemblyCode.split('\n');
        var holders = this.createHolders(lines);
        this.setupAllArgValues(holders);
        var machineCode = this.getMachineCode(holders);
        this.machineCodeInput.value = machineCode;
    };
    AssemblyController.prototype.createHolders = function (lines) {
        var _this = this;
        var holders = [];
        lines.forEach(function (line) {
            var holder = _this.convertLine(line);
            if (holder != null) {
                holders.push(holder);
            }
        });
        return holders;
    };
    AssemblyController.prototype.convertLine = function (line) {
        var parts = line.split(' ');
        Logger.write("assemblyController", "line parts: " + parts);
        if (parts.length > 0) {
            var name = parts[0];
            var args = parts.splice(1);
            return this.createHolder(name, args);
        }
        return null;
    };
    AssemblyController.prototype.createHolder = function (name, args) {
        Logger.write("assemblyController", "createCommand from '" + name + "', " + args);
        var handler = this.helper.findHandlerByName(name);
        if (handler != null) {
            var argCount = handler.shortArgs + handler.wideArgs;
            if (args.length == argCount) {
                return new AssemblyHolder(handler, args);
            }
            else {
                Logger.write("assemblyController", "wrong arg count: " + args.length + ", but " + argCount + " expected");
            }
        }
        else {
            Logger.write("assemblyController", "unknown command: '" + name + "'");
        }
        return null;
    };
    AssemblyController.prototype.setupAllArgValues = function (holders) {
        var _this = this;
        holders.forEach(function (holder) {
            _this.setupArgValues(holder);
        });
    };
    AssemblyController.prototype.setupArgValues = function (holder) {
        var _this = this;
        holder.argHolders.forEach(function (item) { return _this.setupArgValue(item); });
    };
    AssemblyController.prototype.parseInt = function (value) {
        return parseInt(value, AssemblyController.InputRadix);
    };
    AssemblyController.prototype.getRegisterAddrByName = function (name) {
        return this.parseInt(name.slice(1)) - 1;
    };
    AssemblyController.prototype.tryConvertRegisterAbbr = function (arg) {
        var value = arg.rawValue;
        if (value.startsWith("%")) {
            arg.readyValue = this.getRegisterAddrByName(value);
            return true;
        }
        return false;
    };
    AssemblyController.prototype.setupArgValue = function (arg) {
        if (!this.tryConvertRegisterAbbr(arg)) {
            arg.readyValue = this.parseInt(arg.rawValue);
        }
    };
    AssemblyController.prototype.toProperCodeString = function (value, len) {
        var str = value.toString(2);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    };
    AssemblyController.prototype.convertArgs = function (args) {
        var _this = this;
        var str = "";
        args.forEach(function (arg) {
            var argValue = _this.toProperCodeString(arg.readyValue, arg.size);
            argValue += " ";
            str += argValue;
        });
        return str;
    };
    AssemblyController.prototype.getMachineCode = function (holders) {
        var _this = this;
        var machineCode = "";
        holders.forEach(function (holder) {
            machineCode += _this.toProperCodeString(holder.getHeader(), Command.headerSize);
            machineCode += " ";
            machineCode += _this.convertArgs(holder.argHolders);
            machineCode += "  ";
        });
        return machineCode;
    };
    AssemblyController.InputRadix = 10;
    return AssemblyController;
}());
