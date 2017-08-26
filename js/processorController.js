var ProcessorController = (function () {
    function ProcessorController(model, helper, program, memory, process, next, auto) {
        var _this = this;
        this.charCodeZero = "0".charCodeAt(0);
        this.charCodeNine = "9".charCodeAt(0);
        this.autoInterval = null;
        this.model = model;
        this.helper = helper;
        this.programInput = program;
        this.memoryInput = memory;
        this.processButton = process;
        this.nextButton = next;
        this.autoButton = auto;
        this.processButton.onclick = function () { return _this.onProcess(); };
        this.nextButton.onclick = function () { return _this.onNext(); };
        this.autoButton.onclick = function () { return _this.onAuto(); };
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
        var set = BitSet.fromString(cleanText, cleanText.length);
        this.model.setProgram(set);
    };
    ProcessorController.prototype.onProcess = function () {
        Logger.write("processorController", "onProcess");
        this.resetModel();
        this.model.setTerminatedFlag(false);
        this.readProgram();
    };
    ProcessorController.prototype.onNext = function () {
        Logger.write("processorController", "onNext");
        this.checkTermination();
        if (!this.model.getTerminatedFlag()) {
            this.processCommand();
        }
        else {
            this.stopAuto();
        }
    };
    ProcessorController.prototype.onAuto = function () {
        var _this = this;
        Logger.write("processorController", "onAuto");
        this.autoInterval = setInterval(function () { return _this.onNext(); }, 0.1);
    };
    ProcessorController.prototype.stopAuto = function () {
        if (this.autoInterval != null) {
            window.clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    };
    ProcessorController.prototype.processCommand = function () {
        var model = this.model;
        model.updateCommand();
        this.helper.execCommand(model.command);
    };
    ProcessorController.prototype.checkTermination = function () {
        var model = this.model;
        Logger.write("processorController", "checkTermination: " + model.getCounterRegister().toNum() + "/" + model.program.getSize());
        if (model.getCounterRegister().toNum() + 1 >= model.program.getSize()) {
            model.setTerminatedFlag(true);
        }
    };
    return ProcessorController;
}());
