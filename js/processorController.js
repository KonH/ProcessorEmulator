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
        var _this = this;
        var text = this.programInput.value;
        var textParts = text.split(" ");
        textParts.forEach(function (item) {
            var intValue = parseInt(item, 2);
            if (!isNaN(intValue)) {
                _this.model.addToProgram(item);
            }
        });
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
        switch (model.command.cmd) {
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
    ProcessorController.prototype.reset = function (cmd) {
        cmd.name = "RESET";
        this.model.setRegister(cmd.args[0], 0);
    };
    ProcessorController.prototype.inc = function (cmd) {
        cmd.name = "INC";
        var model = this.model;
        var val = model.registers[cmd.args[0]];
        model.setRegister(cmd.args[0], ++val);
    };
    ProcessorController.prototype.put = function (cmd) {
        cmd.name = "PUT";
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
