var SaveView = (function () {
    function SaveView(model, assembly, node) {
        var _this = this;
        this.model = model;
        this.assembly = assembly;
        this.model.changedCallback = function () { return _this.onModelChanged(); };
        this.node = node;
        this.onModelChanged();
    }
    SaveView.prototype.onModelChanged = function () {
        var _this = this;
        Utils.clearChilds(this.node);
        var saves = this.model.getAll();
        saves.forEach(function (value, key) {
            var item = document.createElement("li");
            var name = document.createElement("a");
            name.innerText = key + " ";
            var loadButton = document.createElement("button");
            loadButton.onclick = function () { return _this.processLoad(key); };
            loadButton.innerText = "Load";
            var removeButton = document.createElement("button");
            removeButton.onclick = function () { return _this.model.remove(key); };
            removeButton.innerText = "Remove";
            item.appendChild(name);
            item.appendChild(loadButton);
            item.appendChild(removeButton);
            _this.node.appendChild(item);
        });
    };
    SaveView.prototype.processLoad = function (key) {
        var content = this.model.load(key);
        if (content != null) {
            this.assembly.setAssemblyText(content);
        }
    };
    return SaveView;
}());
