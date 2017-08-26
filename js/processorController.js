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
        this.helper = new CommandHelper(this.model);
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
        this.helper.execCommand(model.command);
    };
    ProcessorController.prototype.checkTermination = function () {
        var model = this.model;
        if (model.counter + 1 >= model.program.length) {
            model.setTerminated(true);
        }
    };
    return ProcessorController;
}());
