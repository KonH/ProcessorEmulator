class ProcessorModel {
	program : string;
	counter : number;
	command : Command;
	terminated : boolean;
	registers : number[] = [];

	changedCallback : Function = null;

	onModelChanged() {
		if (this.changedCallback != null) {
			this.changedCallback();
		}
	}

	reset() {
		this.program = "";
		this.counter = 0;
		this.command = null;
		this.registers = [0, 0, 0, 0, 0];
		this.terminated = true;
		this.onModelChanged();
	}

	setProgram(program : string) {
		this.program = program;
		this.onModelChanged();
	}

	readBusData(len : number) : string {
		let data = this.program.slice(this.counter, this.counter + len);
		this.counter += len;
		return data;
	}

	updateCommand() {
		let header = this.readBusData(Command.headerSize);
		this.command = new Command(header);
		this.onModelChanged();
	}

	setTerminated(value : boolean) {
		this.terminated = value;
		this.onModelChanged();
	}

	setRegister(index : number, value : number) {
		this.registers[index] = value;
		this.onModelChanged();
	}

	setCounter(value : number) {
		this.counter = value;
		this.onModelChanged();
	}
}