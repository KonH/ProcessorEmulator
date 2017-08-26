var ProcessorView = (function () {
    function ProcessorView(node, memory, model) {
        var _this = this;
        this.node = node;
        this.memoryInput = memory;
        this.model = model;
        this.model.changedCallback = (function () { return _this.onModelChanged(); });
    }
    ProcessorView.prototype.onModelChanged = function () {
        this.clear();
        this.write();
    };
    ProcessorView.prototype.clear = function () {
        var node = this.node;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };
    ProcessorView.prototype.addElement = function (name, value) {
        var childNode = document.createElement("li");
        childNode.innerHTML = "<b>" + name + "</b>: " + value;
        this.node.appendChild(childNode);
    };
    ProcessorView.prototype.formatCommand = function () {
        var cmd = this.model.command;
        if (cmd == null) {
            return "none";
        }
        return cmd.toString();
    };
    ProcessorView.prototype.write = function () {
        var _this = this;
        var model = this.model;
        this.addElement("Current", this.formatCommand());
        this.addElement("Terminated", model.getTerminatedFlag().toString());
        model.getRegisters().forEach(function (value, index) {
            return _this.addElement("R" + index, value.toString() + " (" + value.toNum() + ")");
        });
        this.memoryInput.value = model.getAllMemory().toString();
    };
    return ProcessorView;
}());
