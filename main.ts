class Command {
	body : number[] = [];
	cmd : number = 0;
	name : string = "UNK";
	arg1 : number = 0;
	
	constructor(fullCmd : number) {
		for (var i = 0; i < 4; i++) {
		  this.body[i] = (fullCmd >> i) & 1;
		}
		this.cmd = this.extractNum(0, 2); 
		this.arg1 = this.extractNum(2, 2);
	}

	extractNum(start : number, len : number) : number { 
		let parts = this.body.slice(start, start + len);
		parts = parts.reverse();
		let value = 0;
		for (var i = 0; i < len; i++) {
			let cur = (parts[len - i - 1]) * Math.pow(2, i);
			value += cur;
		}
		return value;
	}

	format() : string {
		return "CMD: " + this.cmd.toString(2) + " (" + this.name + ") ARG1: " + this.arg1.toString(2);
	}
}

class ProcessorController {
	stateNode : HTMLElement;
	programInput : HTMLInputElement;
	processButton : HTMLButtonElement;
	nextButton : HTMLButtonElement;

	program : number[] = [];
	counter : number = -1;
	current : Command = null;
	terminated : boolean = true;

	r1 : number = 0;

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
		this.writeStateView();	
	}

	resetState() {
		this.current = null;
		this.program = [];
		this.counter = -1;
		this.r1 = 0;
	}

	readProgram() {
		let text = this.programInput.value;
		let textParts = text.split(" ");
		textParts.forEach((item) => {
			let intValue = parseInt(item, 2);
			if (!isNaN(intValue)) {
				this.program.push(intValue);
			}
		});
	}

	onProcess() {
		this.terminated = false;
		this.resetState();
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
			case 0b01: this.reset(); break;
			case 0b10: this.inc(); break;
			case 0b11: this.load(); break;
		}
	}

	reset() {
		this.current.name = "RESET";
		this.r1 = 0;
	}

	inc() {
		this.current.name = "INC";
		this.r1++;
	}

	load() {
		this.current.name = "LOAD";
		this.r1 = this.current.arg1;
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
			let s = value.toString(2) + "; ";
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
		this.addToStateView("R1", this.r1.toString(2));
	}
}

var procController = new ProcessorController();