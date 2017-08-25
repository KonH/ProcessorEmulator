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
                this.put(command);
                break;
            case 4:
                this.resetAcc(command);
                break;
            case 5:
                this.incAcc(command);
                break;
            case 6:
                this.putAcc(command);
                break;
            case 7:
                this.jump(command);
                break;
        }
    };
    ProcessorController.prototype.loadCommandData = function (command, count) {
        var data = this.model.readBusData(count * Command.argSize);
        command.loadArgs(data, count);
    };
    ProcessorController.prototype.prepare = function (command, name, args) {
        command.name = name;
        if (args > 0) {
            this.loadCommandData(command, args);
        }
    };
    ProcessorController.prototype.getCommonRegIdx = function (index) {
        return index + 1;
    };
    ProcessorController.prototype.reset = function (cmd) {
        this.prepare(cmd, "RST", 1);
        this.model.setRegister(this.getCommonRegIdx(cmd.args[0]), 0);
    };
    ProcessorController.prototype.inc = function (cmd) {
        this.prepare(cmd, "INC", 1);
        var index = this.getCommonRegIdx(cmd.args[0]);
        var val = model.registers[index];
        model.setRegister(index, ++val);
    };
    ProcessorController.prototype.put = function (cmd) {
        this.prepare(cmd, "PUT", 2);
        this.model.setRegister(this.getCommonRegIdx(cmd.args[0]), cmd.args[1]);
    };
    ProcessorController.prototype.resetAcc = function (cmd) {
        this.prepare(cmd, "RSTA", 0);
        this.model.setRegister(0, 0);
    };
    ProcessorController.prototype.incAcc = function (cmd) {
        this.prepare(cmd, "INCA", 0);
        var val = model.registers[0];
        model.setRegister(0, ++val);
    };
    ProcessorController.prototype.putAcc = function (cmd) {
        this.prepare(cmd, "PUT", 1);
        this.model.setRegister(0, cmd.args[0]);
    };
    ProcessorController.prototype.jump = function (cmd) {
        this.prepare(cmd, "JMP", 1);
        this.model.setCounter(cmd.args[0]);
    };
    ProcessorController.prototype.checkTermination = function () {
        var model = this.model;
        if (model.counter + 1 >= model.program.length) {
            model.setTerminated(true);
        }
    };
    return ProcessorController;
}());
