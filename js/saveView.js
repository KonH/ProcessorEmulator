var SaveView = (function () {
    function SaveView(model, controller, node) {
        var _this = this;
        this.model = model;
        this.controller = controller;
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
            name.innerText = key;
            var loadButton = document.createElement("button");
            loadButton.onclick = function () { return _this.controller.onLoad(key); };
            loadButton.innerText = "Load";
            var removeButton = document.createElement("button");
            removeButton.onclick = function () { return _this.controller.onRemove(key); };
            removeButton.innerText = "Remove";
            item.appendChild(name);
            item.appendChild(loadButton);
            item.appendChild(removeButton);
            _this.node.appendChild(item);
        });
    };
    return SaveView;
}());
