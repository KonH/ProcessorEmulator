class ProcessorView {
	private node : HTMLElement;
	private model : ProcessorModel;

	constructor(node : HTMLElement, model : ProcessorModel) {
		this.node = node;
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

	private formatProgram() : string {
		let program = this.model.program;
		return program.length == 0 ? "none" : program;
	}

	private formatCommand() : string {
		let cmd = this.model.command;
		if (cmd == null) {
			return "none";
		}
		return cmd.format();
	}

	private write() {
		let model = this.model;
		this.addElement("Program", this.formatProgram());
		this.addElement("Current", this.formatCommand());
		this.addElement("Counter", model.counter.toString());
		this.addElement("Terminated", model.terminated.toString());
		model.registers.forEach((value, index) =>
			this.addElement("R" + index, value.toString(2)));
	}
}