class MainController {
	stateNode : HTMLElement;
	programInput : HTMLInputElement;
	processButton : HTMLButtonElement;
	nextButton : HTMLButtonElement;

	program : number[] = [];
	counter : number = -1;
	current : number = 0;
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
		this.current = 0;
		this.program = [];
		this.counter = -1;
		this.r1 = 0;
	}

	readProgram() {
		let text = this.programInput.value;
		let textParts = text.split(" ");
		textParts.forEach((item) => {
			let intValue = parseInt(item);
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

	updateCurrent() : number {
		this.counter++;
		this.current = this.program[this.counter];
		return this.current;
	}

	processCurrent() {
		this.updateCurrent();
		switch (this.current) {
			case 1: this.reset(); break;
			case 2: this.inc(); break;
			case 3: this.load(); break;
		}
	}

	reset() {
		this.r1 = 0;
	}

	inc() {
		this.r1++;
	}

	load() {
		this.r1 = this.updateCurrent();
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
			let s = value.toString() + "; ";
			if (index == this.counter) {
				s = "<b>" + s + "</b>";
			}
			str += s;
		});
		return str;
	}

	writeStateView() {
		this.clearStateView();
		this.addToStateView("Program", this.formatProgram());
		this.addToStateView("Current", this.current.toString());
		this.addToStateView("Counter", this.counter.toString());
		this.addToStateView("Terminated", this.terminated.toString());
		this.addToStateView("R1", this.r1.toString());
	}
}

var mainController = new MainController();