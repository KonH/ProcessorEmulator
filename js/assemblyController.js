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
        var _this = this;
        var machineCode = "";
        var lines = assemblyCode.split('\n');
        lines.forEach(function (line) { return machineCode += _this.convertLine(line); });
        this.machineCodeInput.value = machineCode;
    };
    AssemblyController.prototype.convertLine = function (line) {
        var parts = line.split(' ');
        Logger.write("assemblyController", "line parts: " + parts);
        if (parts.length > 0) {
            var name = parts[0];
            var args = parts.splice(1);
            return this.createCommand(name, args);
        }
        return "";
    };
    AssemblyController.prototype.createCommand = function (name, args) {
        Logger.write("assemblyController", "createCommand from '" + name + "', " + args);
        var handler = this.helper.findHandlerByName(name);
        if (handler != null) {
            var text_1 = "";
            text_1 += handler.header.toString(2) + " ";
            var argCount = handler.shortArgs + handler.wideArgs;
            if (args.length == argCount) {
                args.forEach(function (arg) {
                    return text_1 += arg + " ";
                });
                text_1 += "	";
                return text_1;
            }
            else {
                Logger.write("assemblyController", "wrong arg count: " + args.length + ", but " + argCount + " expected");
            }
        }
        else {
            Logger.write("assemblyController", "unknown command: '" + name + "'");
        }
        return "";
    };
    return AssemblyController;
}());
