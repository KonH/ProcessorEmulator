class ProcessorView {
	private node : HTMLElement;
	private memoryInput : HTMLTextAreaElement;
	private model : ProcessorModel;

	constructor(node : HTMLElement, memory : HTMLTextAreaElement, model : ProcessorModel) {
		this.node = node;
		this.memoryInput = memory;
		this.model = model;
		this.model.changedCallback = (() => this.onModelChanged());
	}

	private onModelChanged() {
		this.clear();
		this.write();
	}

	private clear() {
		let node = this.node;
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	private addElement(name : string, value : string) {
		let childNode = document.createElement("li");
		childNode.innerHTML = "<b>" + name + "</b>: " + value;
		this.node.appendChild(childNode);
	}

	private formatCommand() : string {
		let cmd = this.model.command;
		if (cmd == null) {
			return "none";
		}
		return cmd.toString();
	}

	private formatCounter() {
		let counter = model.getCounterRegister();
		if (counter == null) {
			return "none";
		}
		return counter.toString() + " (" + counter.toNum().toString() + ")";
	}

	private write() {
		let model = this.model;
		this.addElement("Current", this.formatCommand());
		this.addElement("Counter", this.formatCounter());
		this.addElement("Terminated", model.getTerminatedFlag().toString());
		model.registers.forEach((value, index) =>
			this.addElement("R" + index, value.toString()));
		this.memoryInput.value = model.memory.toString();
	}
}