class SaveView {
	model : SaveModel;
	controller : SaveController;
	node : HTMLElement;

	constructor(model : SaveModel, controller : SaveController, node : HTMLElement) {
		this.model = model;
		this.controller = controller;
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
			name.innerText = key;
			let loadButton = <HTMLButtonElement>document.createElement("button");
			loadButton.onclick = () => this.controller.onLoad(key);
			loadButton.innerText = "Load";
			let removeButton = <HTMLButtonElement>document.createElement("button");
			removeButton.onclick = () => this.controller.onRemove(key);
			removeButton.innerText = "Remove";
			item.appendChild(name);
			item.appendChild(loadButton);
			item.appendChild(removeButton);
			this.node.appendChild(item);
		});
	}
}