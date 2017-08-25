class ProcessorController {
	model : ProcessorModel;
	programInput : HTMLInputElement;
	processButton : HTMLButtonElement;
	nextButton : HTMLButtonElement;

	constructor(model : ProcessorModel, program : HTMLInputElement, process : HTMLButtonElement, next : HTMLButtonElement) {
		this.model = model;
		this.programInput = program;
		this.processButton = process;
		this.nextButton = next;
		this.processButton.onclick = () => this.onProcess();
		this.nextButton.onclick = () => this.onNext();
		this.resetModel();
	}

	resetModel() {
		this.model.reset();
	}

	readProgram() {
		let text = this.programInput.value;
		let cleanText = text.replace(/ /g,'');
		this.model.setProgram(cleanText);
	}

	onProcess() {
		this.resetModel();
		this.model.terminated = false;
		this.readProgram();
	}

	onNext() {
		this.checkTermination();
		if (!this.model.terminated) {
			this.processCommand();
		}
	}

	processCommand() {
		let model = this.model;
		model.updateCommand();
		switch (model.command.header) {
			case 0b01: this.reset(model.command); break;
			case 0b10: this.inc(model.command); break;
			case 0b11: this.put(model.command); break;
		}
	}
	
	loadCommandData(command : Command, count : number) {
		let data = this.model.readBusData(count * Command.argSize);
		command.loadArgs(data, count);
	}

	prepare(command : Command, name : string, args : number) {
		command.name = name;
		this.loadCommandData(command, args);
	}

	reset(cmd : Command) {
		this.prepare(cmd, "RESET", 1);
		this.model.setRegister(cmd.args[0], 0);
	}
	
	inc(cmd : Command) {
		this.prepare(cmd, "INC", 1);
		let val = model.registers[cmd.args[0]];
		model.setRegister(cmd.args[0], ++val);
	}
	
	put(cmd : Command) {
		this.prepare(cmd, "PUT", 2);
		this.model.setRegister(cmd.args[0], cmd.args[1]);
	}

	checkTermination() {
		let model = this.model;
		if (model.counter + 1 >= model.program.length) {
			model.setTerminated(true);
		}
	}
}