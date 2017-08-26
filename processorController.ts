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
		let set = BitSet.fromString(cleanText, cleanText.length);
		this.model.setProgram(set);
	}

	private onProcess() {
		Logger.write("processorController", "onProcess");
		this.resetModel();
		this.model.setTerminatedFlag(false);
		this.readProgram();
	}

	private onNext() {
		Logger.write("processorController", "onNext");
		this.checkTermination();
		if (!this.model.getTerminatedFlag()) {
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
		Logger.write(
			"processorController", 
			"checkTermination: " + model.getCounterRegister().toNum() + "/" + model.program.getSize());
		if (model.getCounterRegister().toNum() + 1 >= model.program.getSize()) {
			model.setTerminatedFlag(true);
		}
	}
}