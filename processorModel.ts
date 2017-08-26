class ProcessorModel {
	program : BitSet;
	command : Command;
	private registers : BitSet[];
	private memory : BitSet;

	changedCallback : Function = null;

	private onModelChanged() {
		if (this.changedCallback != null) {
			this.changedCallback();
		}
	}

	constructor() {
		this.registers = Array(Setup.regCount);
	}

	reset() {
		this.program = null;
		this.command = null;
		this.registers.fill(new BitSet(Setup.regSize));
		this.memory = new BitSet(Setup.memorySize);
		this.onModelChanged();
	}

	private getCounterRegIdx() {
		return 0;
	}

	private getSystemRegIdx() {
		return 1;
	}

	private getAccumRegIdx() {
		return 2;
	}

	private getCommonRegIdx(index : BitSet) {
		return index.toNum() + Setup.serviceRegCount;
	}

	getCounterRegister() : BitSet {
		return this.registers[this.getCounterRegIdx()];
	}

	getSystemRegister() : BitSet {
		return this.registers[this.getSystemRegIdx()];
	}

	setProgram(program : BitSet) {
		this.program = program;
		this.onModelChanged();
	}

	getTerminatedFlag() : boolean {
		return this.getSystemRegister().getBit(Setup.terminatedBit);
	}

	getCommonRegister(index : BitSet) : BitSet {
		let commonRegIdx = this.getCommonRegIdx(index);
		return this.registers[commonRegIdx];
	}

	getAccumRegister() : BitSet {
		let accRegIdx = this.getAccumRegIdx();
		return this.registers[accRegIdx];
	}

	getRegisters() : BitSet[] {
		return this.registers;
	}

	getMemory(address : BitSet, len : number) : BitSet {
		return this.memory.subset(address.toNum(), len);
	}

	getAllMemory() : BitSet {
		return this.memory;
	}

	readBusData(len : number) : BitSet {
		let counter = this.getCounterRegister();
		let data = this.program.subset(counter.toNum(), len);
		let newCounter = counter.addValue(len);
		Logger.write("processorModel", "readBusData: counter: " + counter + " => " + newCounter);
		this.setCounter(newCounter);
		this.onModelChanged();
		return data;
	}

	updateCommand() {
		let header = this.readBusData(Setup.headerSize);
		this.command = new Command(header);
		this.onModelChanged();
	}

	setTerminatedFlag(value : boolean) {
		let idx = this.getSystemRegIdx();
		let regs = this.registers;
		regs[idx] = regs[idx].setOneBit(Setup.terminatedBit, value);
		this.onModelChanged();
	}

	setCommonRegister(index : BitSet, value : BitSet) {
		let commonRegIdx = this.getCommonRegIdx(index);
		this.setRegister(commonRegIdx, value);
	}

	setAccumRegister(value : BitSet) {
		let accRegIdx = this.getAccumRegIdx();
		this.setRegister(accRegIdx, value);
	}

	private setRegister(index : number, value : BitSet) {
		Logger.write("processorModel", "setRegister: " + index + ": " + value.toString())
		this.registers[index] = value;
		this.onModelChanged();
	}

	setCounter(value : BitSet) {
		Logger.write("processorModel", "setCounter: " + value.toString())
		this.registers[this.getCounterRegIdx()] = value;
		this.onModelChanged();
	}

	setMemory(address : BitSet, content : BitSet) {
		Logger.write("processorModel", "setMemory: at " + address.toString() + ": " + content.toString());
		this.memory = this.memory.setBits(address.toNum(), content);
		this.onModelChanged();
	}
}