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
		let textParts = text.split(" ");
		textParts.forEach((item) => {
			let intValue = parseInt(item, 2);
			if (!isNaN(intValue)) {
				this.model.addToProgram(item);
			}
		});
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
		switch (model.command.cmd) {
			case 0b01: this.reset(model.command); break;
			case 0b10: this.inc(model.command); break;
			case 0b11: this.put(model.command); break;
		}
	}
	
	reset(cmd : Command) {
		cmd.name = "RESET";
		this.model.setRegister(cmd.args[0], 0);
	}
	
	inc(cmd : Command) {
		cmd.name = "INC";
		let model = this.model;
		let val = model.registers[cmd.args[0]];
		model.setRegister(cmd.args[0], ++val);
	}
	
	put(cmd : Command) {
		cmd.name = "PUT";
		this.model.setRegister(cmd.args[0], cmd.args[1]);
	}

	checkTermination() {
		let model = this.model;
		if (model.counter + 1 >= model.program.length) {
			model.setTerminated(true);
		}
	}
}