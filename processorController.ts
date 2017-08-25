class ProcessorController {
	model : ProcessorModel;
	programInput : HTMLTextAreaElement;
	processButton : HTMLButtonElement;
	nextButton : HTMLButtonElement;

	charCodeZero = "0".charCodeAt(0);
	charCodeNine = "9".charCodeAt(0);

	constructor(model : ProcessorModel, program : HTMLTextAreaElement, process : HTMLButtonElement, next : HTMLButtonElement) {
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
	
	isDigitCode(n : number) : boolean {
	   return (n >= this.charCodeZero && n <= this.charCodeNine);
	}

	readProgram() {
		let text = this.programInput.value;
		let cleanText = "";
		for (var i = 0; i < text.length; i++) {
			let code = text.charCodeAt(i);
			if (this.isDigitCode(code)) {
				cleanText += text.charAt(i);
			}
		}
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
		let command = model.command;
		switch (command.header) {
			case 0b001: this.reset(command); break;
			case 0b010: this.inc(command); break;
			case 0b011: this.put(command); break;
			case 0b100: this.resetAcc(command); break;
			case 0b101: this.incAcc(command); break;
			case 0b110: this.putAcc(command); break;
			case 0b111: this.jump(command); break;
		}
	}
	
	loadCommandData(command : Command, count : number) {
		let data = this.model.readBusData(count * Command.argSize);
		command.loadArgs(data, count);
	}

	prepare(command : Command, name : string, args : number) {
		command.name = name;
		if (args > 0) {
		this.loadCommandData(command, args);
		}
	}

	getCommonRegIdx(index : number) {
		return index + 1;
	}

	reset(cmd : Command) {
		this.prepare(cmd, "RST", 1);
		this.model.setRegister(this.getCommonRegIdx(cmd.args[0]), 0);
	}
	
	inc(cmd : Command) {
		this.prepare(cmd, "INC", 1);
		let index = this.getCommonRegIdx(cmd.args[0]);
		let val = model.registers[index];
		model.setRegister(index, ++val);
	}
	
	put(cmd : Command) {
		this.prepare(cmd, "PUT", 2);
		this.model.setRegister(this.getCommonRegIdx(cmd.args[0]), cmd.args[1]);
	}

	resetAcc(cmd : Command) {
		this.prepare(cmd, "RSTA", 0);
		this.model.setRegister(0, 0);
	}
	
	incAcc(cmd : Command) {
		this.prepare(cmd, "INCA", 0);
		let val = model.registers[0];
		model.setRegister(0, ++val);
	}
	
	putAcc(cmd : Command) {
		this.prepare(cmd, "PUT", 1);
		this.model.setRegister(0, cmd.args[0]);
	}

	jump(cmd : Command) {
		this.prepare(cmd, "JMP", 1);
		this.model.setCounter(cmd.args[0]);
	}

	checkTermination() {
		let model = this.model;
		if (model.counter + 1 >= model.program.length) {
			model.setTerminated(true);
		}
	}
}