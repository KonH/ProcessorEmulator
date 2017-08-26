var ProcessorController = (function () {
    function ProcessorController(model, program, process, next) {
        var _this = this;
        this.charCodeZero = "0".charCodeAt(0);
        this.charCodeNine = "9".charCodeAt(0);
        this.model = model;
        this.programInput = program;
        this.processButton = process;
        this.nextButton = next;
        this.processButton.onclick = function () { return _this.onProcess(); };
        this.nextButton.onclick = function () { return _this.onNext(); };
        this.resetModel();
    }
    ProcessorController.prototype.resetModel = function () {
        this.model.reset();
    };
    ProcessorController.prototype.isDigitCode = function (n) {
        return (n >= this.charCodeZero && n <= this.charCodeNine);
    };
    ProcessorController.prototype.readProgram = function () {
        var text = this.programInput.value;
        var cleanText = "";
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (this.isDigitCode(code)) {
                cleanText += text.charAt(i);
            }
        }
        this.model.setProgram(cleanText);
    };
    ProcessorController.prototype.onProcess = function () {
        this.resetModel();
        this.model.terminated = false;
        this.readProgram();
    };
    ProcessorController.prototype.onNext = function () {
        this.checkTermination();
        if (!this.model.terminated) {
            this.processCommand();
        }
    };
    ProcessorController.prototype.processCommand = function () {
        var model = this.model;
        model.updateCommand();
        var command = model.command;
        switch (command.header) {
            case 1:
                this.reset(command);
                break;
            case 2:
                this.inc(command);
                break;
            case 3:
                this.move(command);
                break;
            case 4:
                this.resetAcc(command);
                break;
            case 5:
                this.incAcc(command);
                break;
            case 6:
                this.moveAcc(command);
                break;
            case 7:
                this.jump(command);
                break;
            case 8:
                this.jumpZero(command);
                break;
            case 9:
                this.jumpEqual(command);
                break;
        }
    };
    ProcessorController.prototype.loadCommandDataWide = function (command, count) {
        var data = this.model.readBusData(count * Command.wideArgSize);
        command.loadWideArgs(data, count);
    };
    ProcessorController.prototype.loadCommandDataShort = function (command, count) {
        var data = this.model.readBusData(count * Command.shortArgSize);
        command.loadShortArgs(data, count);
    };
    ProcessorController.prototype.prepareCommand = function (command, name, shortArgs, wideArgs) {
        Logger.write("controller", "prepareCommand: " + name + ", short: " + shortArgs + ", wide: " + wideArgs);
        command.name = name;
        if (shortArgs > 0) {
            this.loadCommandDataShort(command, shortArgs);
        }
        if (wideArgs > 0) {
            this.loadCommandDataWide(command, wideArgs);
        }
    };
    ProcessorController.prototype.getCommonRegIdx = function (index) {
        return index + 1;
    };
    ProcessorController.prototype.reset = function (cmd) {
        this.prepareCommand(cmd, "RST", 1, 0);
        this.model.setRegister(this.getCommonRegIdx(cmd.args[0]), 0);
    };
    ProcessorController.prototype.inc = function (cmd) {
        this.prepareCommand(cmd, "INC", 1, 0);
        var index = this.getCommonRegIdx(cmd.args[0]);
        var val = model.registers[index];
        model.setRegister(index, ++val);
    };
    ProcessorController.prototype.commonMove = function (fromIdx, toIdx) {
        var fromValue = this.model.registers[fromIdx];
        this.model.setRegister(toIdx, fromValue);
    };
    ProcessorController.prototype.move = function (cmd) {
        this.prepareCommand(cmd, "MOV", 2, 0);
        var fromIdx = this.getCommonRegIdx(cmd.args[0]);
        var toIdx = this.getCommonRegIdx(cmd.args[1]);
        this.commonMove(fromIdx, toIdx);
    };
    ProcessorController.prototype.resetAcc = function (cmd) {
        this.prepareCommand(cmd, "RSTA", 0, 0);
        this.model.setRegister(0, 0);
    };
    ProcessorController.prototype.incAcc = function (cmd) {
        this.prepareCommand(cmd, "INCA", 0, 0);
        var val = model.registers[0];
        model.setRegister(0, ++val);
    };
    ProcessorController.prototype.moveAcc = function (cmd) {
        this.prepareCommand(cmd, "MOVA", 1, 0);
        var fromIdx = this.getCommonRegIdx(cmd.args[0]);
        this.commonMove(fromIdx, 0);
    };
    ProcessorController.prototype.jump = function (cmd) {
        this.prepareCommand(cmd, "JMP", 0, 1);
        this.model.setCounter(cmd.args[0]);
    };
    ProcessorController.prototype.jumpZero = function (cmd) {
        this.prepareCommand(cmd, "JMZ", 1, 1);
        var idx = this.getCommonRegIdx(cmd.args[0]);
        var condition = this.model.registers[idx] == 0;
        if (condition) {
            this.model.setCounter(cmd.args[1]);
        }
    };
    ProcessorController.prototype.jumpEqual = function (cmd) {
        this.prepareCommand(cmd, "JME", 2, 1);
        var leftIdx = this.getCommonRegIdx(cmd.args[0]);
        var rightIdx = this.getCommonRegIdx(cmd.args[0]);
        var registers = this.model.registers;
        var condition = registers[leftIdx] == registers[rightIdx];
        if (condition) {
            this.model.setCounter(cmd.args[0]);
        }
    };
    ProcessorController.prototype.checkTermination = function () {
        var model = this.model;
        if (model.counter + 1 >= model.program.length) {
            model.setTerminated(true);
        }
    };
    return ProcessorController;
}());
