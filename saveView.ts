class SaveView {
	model : SaveModel;
	assembly : AssemblyController;
	node : HTMLElement;

	constructor(model : SaveModel, assembly : AssemblyController, node : HTMLElement) {
		this.model = model;
		this.assembly = assembly;
		this.model.changedCallback = () => this.onModelChanged();
		this.node = node;
		this.onModelChanged();
	}

	private onModelChanged() {
		Utils.clearChilds(this.node);
		let saves = this.model.getAll();
		saves.forEach((value, key) => {
			let item = document.createElement("li");
			let name = document.createElement("a");
			name.innerText = key + " ";
			let loadButton = <HTMLButtonElement>document.createElement("button");
			loadButton.onclick = () => this.processLoad(key);
			loadButton.innerText = "Load";
			let removeButton = <HTMLButtonElement>document.createElement("button");
			removeButton.onclick = () => this.model.remove(key);
			removeButton.innerText = "Remove";
			item.appendChild(name);
			item.appendChild(loadButton);
			item.appendChild(removeButton);
			this.node.appendChild(item);
		});
	}

	private processLoad(key : string) {
		let content = this.model.load(key);
		if (content != null) {
			this.assembly.setAssemblyText(content);
		}
	}
}