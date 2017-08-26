class ProcessorController {
	model : ProcessorModel;
	programInput : HTMLTextAreaElement;
	processButton : HTMLButtonElement;
	nextButton : HTMLButtonElement;

	helper : CommandHelper;
	charCodeZero = "0".charCodeAt(0);
	charCodeNine = "9".charCodeAt(0);

	constructor(model : ProcessorModel, program : HTMLTextAreaElement, process : HTMLButtonElement, next : HTMLButtonElement) {
		this.model = model;
		this.programInput = program;
		this.processButton = process;
		this.nextButton = next;
		this.processButton.onclick = () => this.onProcess();
		this.nextButton.onclick = () => this.onNext();
		
		this.helper = new CommandHelper(this.model);

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
		this.helper.execCommand(model.command);
	}

	checkTermination() {
		let model = this.model;
		if (model.counter + 1 >= model.program.length) {
			model.setTerminated(true);
		}
	}
}