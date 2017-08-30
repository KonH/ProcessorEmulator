var SaveController = (function () {
    function SaveController(model, assembly, saveName, saveButton) {
        var _this = this;
        this.model = model;
        this.assembly = assembly;
        this.saveName = saveName;
        this.saveButton = saveButton;
        this.saveButton.onclick = function () { return _this.onSaveClick(); };
        this.model.update();
    }
    SaveController.prototype.onSaveClick = function () {
        var content = this.assembly.getAssemblyText();
        var name = this.saveName.value;
        this.save(name, content);
        this.saveName.value = "";
    };
    SaveController.prototype.save = function (name, content) {
        Logger.write("SaveController", "Save: '" + name + "': '" + content + "'");
        this.model.save(name, content);
    };
    SaveController.prototype.onLoad = function (name) {
        var content = this.model.load(name);
        this.assembly.setAssemblyText(content);
    };
    SaveController.prototype.onRemove = function (name) {
        this.model.remove(name);
    };
    return SaveController;
}());
