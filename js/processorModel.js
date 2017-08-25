var ProcessorModel = (function () {
    function ProcessorModel() {
        this.registers = [];
        this.changedCallback = null;
    }
    ProcessorModel.prototype.onModelChanged = function () {
        if (this.changedCallback != null) {
            this.changedCallback();
        }
    };
    ProcessorModel.prototype.reset = function () {
        this.program = "";
        this.counter = 0;
        this.command = null;
        this.registers = [0, 0, 0, 0, 0];
        this.terminated = true;
        this.onModelChanged();
    };
    ProcessorModel.prototype.setProgram = function (program) {
        this.program = program;
        this.onModelChanged();
    };
    ProcessorModel.prototype.readBusData = function (len) {
        var data = this.program.slice(this.counter, this.counter + len);
        this.counter += len;
        return data;
    };
    ProcessorModel.prototype.updateCommand = function () {
        var header = this.readBusData(Command.headerSize);
        this.command = new Command(header);
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
