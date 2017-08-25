var ProcessorModel = (function () {
    function ProcessorModel() {
        this.registers = [0, 0, 0, 0];
        this.changedCallback = null;
    }
    ProcessorModel.prototype.onModelChanged = function () {
        if (this.changedCallback != null) {
            this.changedCallback();
        }
    };
    ProcessorModel.prototype.reset = function () {
        this.program = [];
        this.counter = -1;
        this.command = null;
        this.registers = [0, 0, 0, 0];
        this.terminated = true;
        this.onModelChanged();
    };
    ProcessorModel.prototype.addToProgram = function (part) {
        this.program.push(part);
        this.onModelChanged();
    };
    ProcessorModel.prototype.updateCommand = function () {
        this.counter++;
        this.command = new Command(this.program[this.counter]);
        this.onModelChanged();
    };
    ProcessorModel.prototype.setTerminated = function (value) {
        this.terminated = value;
        this.onModelChanged();
    };
    ProcessorModel.prototype.setRegister = function (index, value) {
        this.registers[index] = value;
        this.onModelChanged();
    };
    return ProcessorModel;
}());
