class ProcessorModel {
	static regCount : number = 8;
	static serviceRegCount : number = 3;
	static regSize : number = 8;
	static terminatedBit = 0;
	static memorySize = 256;

	program : BitSet;
	command : Command;
	registers : BitSet[];
	memory : BitSet;

	changedCallback : Function = null;

	private onModelChanged() {
		if (this.changedCallback != null) {
			this.changedCallback();
		}
	}

	constructor() {
		this.registers = Array(ProcessorModel.regCount);
	}

	reset() {
		this.program = null;
		this.command = null;
		this.registers.fill(new BitSet(ProcessorModel.regSize));
		this.memory = new BitSet(ProcessorModel.memorySize);
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

	getCommonRegIdx(index : BitSet) {
		return index.toNum() + ProcessorModel.serviceRegCount;
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
		return this.getSystemRegister().getBit(ProcessorModel.terminatedBit);
	}

	getMemory(address : BitSet, len : number) : BitSet {
		return this.memory.subset(address.toNum(), len);
	}

	readBusData(len : number) : BitSet {
		let counter = this.getCounterRegister();
		let data = this.program.subset(counter.toNum(), len);
		let newCounter = counter.addValue(len);
		this.setCounter(newCounter);
		this.onModelChanged();
		return data;
	}

	updateCommand() {
		let header = this.readBusData(Command.headerSize);
		this.command = new Command(header);
		this.onModelChanged();
	}

	setTerminatedFlag(value : boolean) {
		let idx = this.getSystemRegIdx();
		let regs = this.registers;
		regs[idx] = regs[idx].setOneBit(ProcessorModel.terminatedBit, value);
		this.onModelChanged();
	}

	setRegister(index : number, value : BitSet) {
		this.registers[index] = value;
		this.onModelChanged();
	}

	setCounter(value : BitSet) {
		this.registers[this.getCounterRegIdx()] = value;
		this.onModelChanged();
	}

	setMemory(address : BitSet, content : BitSet) {
		this.memory = this.memory.setBits(address.toNum(), content);
		this.onModelChanged();
	}
}