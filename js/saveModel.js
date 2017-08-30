var SaveModel = (function () {
    function SaveModel() {
        this.saveName = "saves";
        this.saves = new Map();
        this.currentSave = null;
        this.changedCallback = null;
    }
    SaveModel.prototype.onModelUpdated = function () {
        if (this.changedCallback != null) {
            this.changedCallback();
        }
    };
    SaveModel.prototype.getAll = function () {
        return this.saves;
    };
    SaveModel.prototype.update = function () {
        var content = localStorage.getItem(this.saveName);
        if (content != null) {
            var savedObj = JSON.parse(content);
            for (var key in savedObj) {
                this.saves.set(key, savedObj[key]);
            }
            Logger.write("SaveModel", "update: '" + content + "' => " + this.saves);
        }
        this.onModelUpdated();
    };
    SaveModel.prototype.saveToStorage = function () {
        var saves = this.saves;
        var saveObj = new Object();
        saves.forEach(function (value, key) { return saveObj[key] = value; });
        var content = JSON.stringify(saveObj);
        Logger.write("SaveModel", "saveToStorage: '" + content + "'");
        localStorage.setItem(this.saveName, content);
        this.onModelUpdated();
    };
    SaveModel.prototype.save = function (name, content) {
        this.saves.set(name, content);
        this.saveToStorage();
    };
    SaveModel.prototype.remove = function (name) {
        this.saves.delete(name);
        this.saveToStorage();
    };
    SaveModel.prototype.load = function (name) {
        var item = this.saves.get(name);
        return item === undefined ? null : item;
    };
    return SaveModel;
}());
