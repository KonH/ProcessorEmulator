var ProcessorController = (function () {
    function ProcessorController(model, program, process, next) {
        var _this = this;
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
    ProcessorController.prototype.readProgram = function () {
        var text = this.programInput.value;
        var cleanText = text.replace(/ /g, '');
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
        switch (model.command.header) {
            case 1:
                this.reset(model.command);
                break;
            case 2:
                this.inc(model.command);
                break;
            case 3:
                this.put(model.command);
                break;
            case 4:
                this.resetAcc(model.command);
                break;
            case 5:
                this.incAcc(model.command);
                break;
            case 6:
                this.putAcc(model.command);
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
    ProcessorController.prototype.checkTermination = function () {
        var model = this.model;
        if (model.counter + 1 >= model.program.length) {
            model.setTerminated(true);
        }
    };
    return ProcessorController;
}());
