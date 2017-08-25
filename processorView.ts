class ProcessorView {
	node : HTMLElement;
	model : ProcessorModel;

	constructor(node : HTMLElement, model : ProcessorModel) {
		this.node = node;
		this.model = model;
		this.model.onModelChanged = (() => this.onModelChanged());
	}

	onModelChanged() {
		this.clear();
		this.write();
	}

	clear() {
		let node = this.node;
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	addElement(name : string, value : string) {
		let childNode = document.createElement("li");
		childNode.innerHTML = "<b>" + name + "</b>: " + value;
		this.node.appendChild(childNode);
	}

	formatProgram() : string {
		let str = "";
		let model = this.model;
		model.program.forEach((value, index) => {
			let s = value + "; ";
			if (index == model.counter) {
				s = "<b>" + s + "</b>";
			}
			str += s;
		});
		return str.length == 0 ? "none" : str;
	}

	formatCommand() : string {
		let cmd = this.model.command;
		if (cmd == null) {
			return "none";
		}
		return cmd.format();
	}

	write() {
		let model = this.model;
		this.addElement("Program", this.formatProgram());
		this.addElement("Current", this.formatCommand());
		this.addElement("Counter", model.counter.toString());
		this.addElement("Terminated", model.terminated.toString());
		model.registers.forEach((value, index) =>
			this.addElement("R" + index, value.toString(2)));
	}
}