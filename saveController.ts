class SaveController {
	model : SaveModel;
	assembly : AssemblyController;
	saveName : HTMLInputElement;
	saveButton : HTMLButtonElement;

	constructor(
		model : SaveModel, assembly : AssemblyController, 
		saveName : HTMLInputElement, saveButton : HTMLButtonElement) {
		this.model = model;
		this.assembly = assembly;
		this.saveName = saveName;
		this.saveButton = saveButton;
		this.saveButton.onclick = () => this.onSaveClick();
		this.model.update();
	}

	private onSaveClick() {
		let content = this.assembly.getAssemblyText();
		let name = this.saveName.value;
		this.save(name, content);
		this.saveName.value = "";
	}

	private save(name : string, content : string) {
		Logger.write("SaveController", "Save: '" + name + "': '" + content + "'");
		this.model.save(name, content);
	}
}