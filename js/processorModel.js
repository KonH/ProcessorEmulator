var ProcessorModel = (function () {
    function ProcessorModel() {
        this.changedCallback = null;
        this.registers = Array(Setup.regCount);
    }
    ProcessorModel.prototype.onModelChanged = function () {
        if (this.changedCallback != null) {
            this.changedCallback();
        }
    };
    ProcessorModel.prototype.reset = function () {
        this.program = null;
        this.command = null;
        this.registers.fill(new BitSet(true, Setup.regSize));
        this.memory = new BitSet(false, Setup.memorySize);
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
        return index.toNum() + Setup.serviceRegCount;
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
        return this.getSystemRegister().getBit(Setup.terminatedBit);
    };
    ProcessorModel.prototype.getCommonRegister = function (index) {
        var commonRegIdx = this.getCommonRegIdx(index);
        return this.registers[commonRegIdx];
    };
    ProcessorModel.prototype.getAccumRegister = function () {
        var accRegIdx = this.getAccumRegIdx();
        return this.registers[accRegIdx];
    };
    ProcessorModel.prototype.getRegisters = function () {
        return this.registers;
    };
    ProcessorModel.prototype.getMemory = function (signed, address, len) {
        return this.memory.subset(signed, address.toNum(), len);
    };
    ProcessorModel.prototype.getAllMemory = function () {
        return this.memory;
    };
    ProcessorModel.prototype.readBusData = function (signed, len) {
        var counter = this.getCounterRegister();
        var data = this.program.subset(signed, counter.toNum(), len);
        var newCounter = counter.addValue(len);
        Logger.write("processorModel", "readBusData: counter: " + counter.toStringComplex() +
            " => " + newCounter.toStringComplex());
        this.setCounter(newCounter);
        this.onModelChanged();
        return data;
    };
    ProcessorModel.prototype.updateCommand = function () {
        var header = this.readBusData(false, Setup.headerSize);
        this.command = new Command(header);
        this.onModelChanged();
    };
    ProcessorModel.prototype.setTerminatedFlag = function (value) {
        var idx = this.getSystemRegIdx();
        var regs = this.registers;
        regs[idx] = regs[idx].setOneBit(Setup.terminatedBit, value);
        this.onModelChanged();
    };
    ProcessorModel.prototype.setCommonRegister = function (index, value) {
        var commonRegIdx = this.getCommonRegIdx(index);
        this.setRegister(commonRegIdx, value);
    };
    ProcessorModel.prototype.setAccumRegister = function (value) {
        var accRegIdx = this.getAccumRegIdx();
        this.setRegister(accRegIdx, value);
    };
    ProcessorModel.prototype.setRegister = function (index, value) {
        Logger.write("processorModel", "setRegister [" + index + "]: " + value.toStringComplex());
        this.registers[index] = value;
        this.onModelChanged();
    };
    ProcessorModel.prototype.setCounter = function (value) {
        Logger.write("processorModel", "setCounter: " + value.toStringComplex());
        this.registers[this.getCounterRegIdx()] = value;
        this.onModelChanged();
    };
    ProcessorModel.prototype.setMemory = function (address, content) {
        Logger.write("processorModel", "setMemory: at " + address.toStringComplex() + ": " + content.toStringComplex());
        this.memory = this.memory.setBits(address.toNum(), content);
        this.onModelChanged();
    };
    return ProcessorModel;
}());
