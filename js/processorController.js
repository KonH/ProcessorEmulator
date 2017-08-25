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
        }
    };
    ProcessorController.prototype.loadCommandData = function (command, count) {
        var data = this.model.readBusData(count * Command.argSize);
        command.loadArgs(data, count);
    };
    ProcessorController.prototype.prepare = function (command, name, args) {
        command.name = name;
        this.loadCommandData(command, args);
    };
    ProcessorController.prototype.reset = function (cmd) {
        this.prepare(cmd, "RESET", 1);
        this.model.setRegister(cmd.args[0], 0);
    };
    ProcessorController.prototype.inc = function (cmd) {
        this.prepare(cmd, "INC", 1);
        var val = model.registers[cmd.args[0]];
        model.setRegister(cmd.args[0], ++val);
    };
    ProcessorController.prototype.put = function (cmd) {
        this.prepare(cmd, "PUT", 2);
        this.model.setRegister(cmd.args[0], cmd.args[1]);
    };
    ProcessorController.prototype.checkTermination = function () {
        var model = this.model;
        if (model.counter + 1 >= model.program.length) {
            model.setTerminated(true);
        }
    };
    return ProcessorController;
}());
