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
			case 0b0001: this.reset(command); break;
			case 0b0010: this.inc(command); break;
			case 0b0011: this.move(command); break;
			case 0b0100: this.resetAcc(command); break;
			case 0b0101: this.incAcc(command); break;
			case 0b0110: this.moveAcc(command); break;
			case 0b0111: this.jump(command); break;
			case 0b1000: this.jumpZero(command); break;
			case 0b1001: this.jumpEqual(command); break;
		}
	}

	loadCommandDataWide(command : Command, count : number) {
		let data = this.model.readBusData(count * Command.wideArgSize);
		command.loadWideArgs(data, count);
	}

	loadCommandDataShort(command : Command, count : number) {
		let data = this.model.readBusData(count * Command.shortArgSize);
		command.loadShortArgs(data, count);
	}

	prepareCommand(command : Command, name : string, shortArgs : number, wideArgs : number) {
		Logger.write(
			"controller", 
			"prepareCommand: " + name + ", short: " + shortArgs + ", wide: " + wideArgs);
		command.name = name;
		if (shortArgs > 0) {
			this.loadCommandDataShort(command, shortArgs);
		}
		if (wideArgs > 0) {
			this.loadCommandDataWide(command, wideArgs);
		}
	}

	getCommonRegIdx(index : number) {
		return index + 1;
	}

	reset(cmd : Command) {
		this.prepareCommand(cmd, "RST", 1, 0);
		this.model.setRegister(this.getCommonRegIdx(cmd.args[0]), 0);
	}
	
	inc(cmd : Command) {
		this.prepareCommand(cmd, "INC", 1, 0);
		let index = this.getCommonRegIdx(cmd.args[0]);
		let val = model.registers[index];
		model.setRegister(index, ++val);
	}
	
	commonMove(fromIdx : number, toIdx : number) {
		let fromValue = this.model.registers[fromIdx];
		this.model.setRegister(toIdx, fromValue);
	}

	move(cmd : Command) {
		this.prepareCommand(cmd, "MOV", 2, 0);
		let fromIdx = this.getCommonRegIdx(cmd.args[0]);
		let toIdx = this.getCommonRegIdx(cmd.args[1]); 
		this.commonMove(fromIdx, toIdx);
	}

	resetAcc(cmd : Command) {
		this.prepareCommand(cmd, "RSTA", 0, 0);
		this.model.setRegister(0, 0);
	}
	
	incAcc(cmd : Command) {
		this.prepareCommand(cmd, "INCA", 0, 0);
		let val = model.registers[0];
		model.setRegister(0, ++val);
	}
	
	moveAcc(cmd : Command) {
		this.prepareCommand(cmd, "MOVA", 1, 0);
		let fromIdx = this.getCommonRegIdx(cmd.args[0]);
		this.commonMove(fromIdx, 0);
	}

	jump(cmd : Command) {
		this.prepareCommand(cmd, "JMP", 0, 1);
		this.model.setCounter(cmd.args[0]);
	}

	jumpZero(cmd : Command) {
		this.prepareCommand(cmd, "JMZ", 1, 1);
		let idx = this.getCommonRegIdx(cmd.args[0]);
		let condition = this.model.registers[idx] == 0;
		if (condition) {
			this.model.setCounter(cmd.args[1]);
		}
	}

	jumpEqual(cmd : Command) {
		this.prepareCommand(cmd, "JME", 2, 1);
		let leftIdx = this.getCommonRegIdx(cmd.args[0]);
		let rightIdx = this.getCommonRegIdx(cmd.args[0]);
		let registers = this.model.registers;
		let condition = registers[leftIdx] == registers[rightIdx];
		if (condition) {
			this.model.setCounter(cmd.args[0]);
		}
	}

	checkTermination() {
		let model = this.model;
		if (model.counter + 1 >= model.program.length) {
			model.setTerminated(true);
		}
	}
}