class Command {
	body : number[] = [];
	cmd : number = 0;
	name : string = "UNK";
	args : number[] = [];

	constructor(cmd : string) {
		for (var i = 0; i < 10; i++) {
		  this.body[i] = cmd.length > i ? parseInt(cmd[i]) : 0;
		}
		this.cmd = this.extractNum(0, 2);
		this.args = [];
		for (var i = 0; i < 2; i++) {
			this.args.push(this.extractNum(2 + i * 2, 2));
		}
	}

	extractNum(start : number, len : number) : number { 
		let parts = this.body.slice(start, start + len);
		let value = 0;
		for (var i = 0; i < len; i++) {
			let cur = (parts[len - i - 1]) * Math.pow(2, i);
			value += cur;
		}
		return value;
	}

	format() : string {
		let line = "";
		this.args.forEach((value) => {
			line += value.toString(2) + ";";
		});
		return "CMD: " + this.cmd.toString(2) + " (" + this.name + 
		") ARGS: [" + line + "]";
	}
}

class ProcessorController {
	stateNode : HTMLElement;
	programInput : HTMLInputElement;
	processButton : HTMLButtonElement;
	nextButton : HTMLButtonElement;

	program : string[];
	counter : number;
	current : Command;
	terminated : boolean;

	regs : number[] = [0, 0, 0, 0];

	constructor() {
		this.stateNode = document.getElementById("state");
		this.programInput = 
			<HTMLInputElement>document.getElementById("programInput");
		this.processButton = 
			<HTMLButtonElement>document.getElementById("processBtn");
		this.processButton.onclick = () => this.onProcess();
		this.nextButton = 
			<HTMLButtonElement>document.getElementById("nextBtn");
		this.nextButton.onclick = () => this.onNext();
		this.resetState();
		this.writeStateView();	
	}

	resetState() {
		this.program = [];
		this.counter = -1;
		this.current = null;
		this.regs = [0, 0, 0, 0];
		this.terminated = true;
	}

	readProgram() {
		let text = this.programInput.value;
		let textParts = text.split(" ");
		textParts.forEach((item) => {
			let intValue = parseInt(item, 2);
			if (!isNaN(intValue)) {
				this.program.push(item);
			}
		});
	}

	onProcess() {
		this.resetState();
		this.terminated = false;
		this.readProgram();
		this.writeStateView();
	}

	onNext() {
		this.checkTermination();
		
		if (!this.terminated) {
			this.processCurrent();
		}

		this.writeStateView();
	}

	updateCurrent() : Command {
		this.counter++;
		this.current = new Command(this.program[this.counter]);
		return this.current;
	}

	processCurrent() {
		this.updateCurrent();
		switch (this.current.cmd) {
			case 0b01: this.reset(this.current); break;
			case 0b10: this.inc(this.current); break;
			case 0b11: this.put(this.current); break;
		}
	}

	reset(cmd : Command) {
		cmd.name = "RESET";
		this.regs[cmd.args[0]] = 0;
	}

	inc(cmd : Command) {
		cmd.name = "INC";
		this.regs[cmd.args[0]]++;
	}

	put(cmd : Command) {
		cmd.name = "PUT";
		this.regs[cmd.args[0]] = cmd.args[1];
	}

	checkTermination() {
		if (this.counter + 1 >= this.program.length) {
			this.terminated = true;
		}
	}

	clearStateView() {
		let node = this.stateNode;
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	addToStateView(name : string, value : string) {
		let childNode = document.createElement("li");
		childNode.innerHTML = "<b>" + name + "</b>: " + value;
		this.stateNode.appendChild(childNode);
	}

	formatProgram() : string {
		let str = "";
		this.program.forEach((value, index) => {
			let s = value + "; ";
			if (index == this.counter) {
				s = "<b>" + s + "</b>";
			}
			str += s;
		});
		return str;
	}

	formatCommand() : string {
		if (this.current == null) {
			return "none";
		}
		return this.current.format();
	}

	writeStateView() {
		this.clearStateView();
		this.addToStateView("Program", this.formatProgram());
		this.addToStateView("Current", this.formatCommand());
		this.addToStateView("Counter", this.counter.toString());
		this.addToStateView("Terminated", this.terminated.toString());
		this.regs.forEach((value, index) =>
			this.addToStateView("R" + index, value.toString(2)));
	}
}

var procController = new ProcessorController();