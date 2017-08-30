class SaveModel {
	private saveName = "saves";
	private saves:Map<string, string> = new Map<string, string>();

	changedCallback : Function = null;

	private onModelUpdated() {
		if (this.changedCallback != null) {
			this.changedCallback();
		}
	}

	getAll() : Map<string, string> {
		return this.saves;
	}

	update() {
		let content = localStorage.getItem(this.saveName);
		if (content != null) {
			let savedObj = JSON.parse(content);
			for (var key in savedObj) {
				this.saves.set(key, savedObj[key]);
			}
			Logger.write("SaveModel", "update: '" + content + "' => " + this.saves);
		}
		this.onModelUpdated();
	}

	private saveToStorage() {
		let saves = this.saves;
		let saveObj = new Object();
		saves.forEach((value, key) => saveObj[key] = value);
		let content = JSON.stringify(saveObj);
		Logger.write("SaveModel", "saveToStorage: '" + content + "'");
		localStorage.setItem(this.saveName, content);
		this.onModelUpdated();
	}

	save(name : string, content : string) {
		this.saves.set(name, content);
		this.saveToStorage();
	}

	remove(name : string) {
		this.saves.delete(name);
		this.saveToStorage();
	}

	load(name : string) : string {
		let item = this.saves.get(name);
		return item === undefined ? null : item;
	}
}