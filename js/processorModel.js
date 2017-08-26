var ProcessorModel = (function () {
    function ProcessorModel() {
        this.changedCallback = null;
        this.registers = Array(ProcessorModel.regCount);
    }
    ProcessorModel.prototype.onModelChanged = function () {
        if (this.changedCallback != null) {
            this.changedCallback();
        }
    };
    ProcessorModel.prototype.reset = function () {
        this.program = null;
        this.command = null;
        this.registers.fill(new BitSet(ProcessorModel.regSize));
        this.memory = new BitSet(ProcessorModel.memorySize);
        this.onModelChanged();
    };
    ProcessorModel.prototype.getCounterRegIdx = function () {
        return 0;
    };
    ProcessorModel.prototype.getSystemRegIdx = function () {
        return 1;
    };
    ProcessorModel.prototype.getAccumRegIdx = function () {
        return 2;
    };
    ProcessorModel.prototype.getCommonRegIdx = function (index) {
        return index.toNum() + ProcessorModel.serviceRegCount;
    };
    ProcessorModel.prototype.getCounterRegister = function () {
        return this.registers[this.getCounterRegIdx()];
    };
    ProcessorModel.prototype.getSystemRegister = function () {
        return this.registers[this.getSystemRegIdx()];
    };
    ProcessorModel.prototype.setProgram = function (program) {
        this.program = program;
        this.onModelChanged();
    };
    ProcessorModel.prototype.getTerminatedFlag = function () {
        return this.getSystemRegister().getBit(ProcessorModel.terminatedBit);
    };
    ProcessorModel.prototype.getMemory = function (address, len) {
        return this.memory.subset(address.toNum(), len);
    };
    ProcessorModel.prototype.readBusData = function (len) {
        var counter = this.getCounterRegister();
        var data = this.program.subset(counter.toNum(), len);
        var newCounter = counter.addValue(len);
        Logger.write("processorModel", "readBusData: counter: " + counter + " => " + newCounter);
        this.setCounter(newCounter);
        this.onModelChanged();
        return data;
    };
    ProcessorModel.prototype.updateCommand = function () {
        var header = this.readBusData(Command.headerSize);
        this.command = new Command(header);
        this.onModelChanged();
    };
    ProcessorModel.prototype.setTerminatedFlag = function (value) {
        var idx = this.getSystemRegIdx();
        var regs = this.registers;
        regs[idx] = regs[idx].setOneBit(ProcessorModel.terminatedBit, value);
        this.onModelChanged();
    };
    ProcessorModel.prototype.setRegister = function (index, value) {
        Logger.write("processorModel", "setRegister: " + index + ": " + value.toString());
        this.registers[index] = value;
        this.onModelChanged();
    };
    ProcessorModel.prototype.setCounter = function (value) {
        Logger.write("processorModel", "setCounter: " + value.toString());
        this.registers[this.getCounterRegIdx()] = value;
        this.onModelChanged();
    };
    ProcessorModel.prototype.setMemory = function (address, content) {
        Logger.write("processorModel", "setMemory: at " + address.toString() + ": " + content.toString());
        this.memory = this.memory.setBits(address.toNum(), content);
        this.onModelChanged();
    };
    ProcessorModel.regCount = 8;
    ProcessorModel.serviceRegCount = 3;
    ProcessorModel.regSize = 8;
    ProcessorModel.terminatedBit = 0;
    ProcessorModel.memorySize = 256;
    return ProcessorModel;
}());
