class ProcessorModel {
	program : string[];
	counter : number;
	command : Command;
	terminated : boolean;
	registers : number[] = [0, 0, 0, 0];

	changedCallback : Function = null;

	onModelChanged() {
		if (this.changedCallback != null) {
			this.changedCallback();
		}
	}

	reset() {
		this.program = [];
		this.counter = -1;
		this.command = null;
		this.registers = [0, 0, 0, 0];
		this.terminated = true;
		this.onModelChanged();
	}

	addToProgram(part : string) {
		this.program.push(part);
		this.onModelChanged();
	}

	updateCommand() {
		this.counter++;
		this.command = new Command(this.program[this.counter]);
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
}