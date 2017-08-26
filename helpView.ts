class HelpView {
	private static ArgNames = ["x", "y", "z", "w"];

	private table : HTMLTableElement;
	private helper : CommandHelper;

	constructor(table : HTMLTableElement, helper : CommandHelper) {
		this.table = table;
		this.helper = helper;
		this.write();
	}

	private write() {
		this.helper.handlers.forEach(item => this.writeItem(item));
	}

	private getTdText(text : string) : string {
		return "<td>" + text + "</td>";
	}

	private getBoldTdText(text : string) : string {
		return this.getTdText("<b>" + text + "</b>");
	}

	private getArgText(index : number, size : number) {
		return " " + HelpView.ArgNames[index] + ":" + size;
	}

	private getFullHeaderText(item : HandlerBase) {
		let header = item.header.toString(2);
		while (header.length < Command.headerSize) {
			header = "0" + header;
		}
		let args = "";
		let shortSize = Command.shortArgSize;
		for (var i = 0; i < item.shortArgs; i++) {
			args += this.getArgText(i, shortSize);
		}
		let wideSize = Command.wideArgSize;
		for (var i = 0; i < item.wideArgs; i++) {
			args += this.getArgText(item.shortArgs + i, wideSize);
		}
		return this.getBoldTdText(header + args);
	}

	private writeItem(item : HandlerBase) {
		let content = "";
		content += this.getBoldTdText(item.name);
		content += this.getFullHeaderText(item);
		content += this.getTdText(item.description);
		let child = document.createElement("tr");
		child.innerHTML = content;
		this.table.appendChild(child);
	}
}