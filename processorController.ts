class ProcessorController {
	private model : ProcessorModel;
	private programInput : HTMLTextAreaElement;
	private processButton : HTMLButtonElement;
	private nextButton : HTMLButtonElement;

	private helper : CommandHelper;
	private charCodeZero = "0".charCodeAt(0);
	private charCodeNine = "9".charCodeAt(0);

	constructor(
		model : ProcessorModel, helper : CommandHelper, 
		program : HTMLTextAreaElement, process : HTMLButtonElement, next : HTMLButtonElement)
	{
		this.model = model;
		this.helper = helper;
		this.programInput = program;
		this.processButton = process;
		this.nextButton = next;
		this.processButton.onclick = () => this.onProcess();
		this.nextButton.onclick = () => this.onNext();
		this.resetModel();
	}

	private resetModel() {
		this.model.reset();
	}
	
	private isDigitCode(n : number) : boolean {
	   return (n >= this.charCodeZero && n <= this.charCodeNine);
	}

	private readProgram() {
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

	private onProcess() {
		this.resetModel();
		this.model.terminated = false;
		this.readProgram();
	}

	private onNext() {
		this.checkTermination();
		if (!this.model.terminated) {
			this.processCommand();
		}
	}

	private processCommand() {
		let model = this.model;
		model.updateCommand();
		this.helper.execCommand(model.command);
	}

	private checkTermination() {
		let model = this.model;
		if (model.counter + 1 >= model.program.length) {
			model.setTerminated(true);
		}
	}
}