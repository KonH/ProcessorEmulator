var ProcessorView = (function () {
    function ProcessorView(node, model) {
        var _this = this;
        this.node = node;
        this.model = model;
        this.model.onModelChanged = (function () { return _this.onModelChanged(); });
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
    ProcessorView.prototype.formatProgram = function () {
        var program = this.model.program;
        return program.length == 0 ? "none" : program;
    };
    ProcessorView.prototype.formatCommand = function () {
        var cmd = this.model.command;
        if (cmd == null) {
            return "none";
        }
        return cmd.format();
    };
    ProcessorView.prototype.write = function () {
        var _this = this;
        var model = this.model;
        this.addElement("Program", this.formatProgram());
        this.addElement("Current", this.formatCommand());
        this.addElement("Counter", model.counter.toString());
        this.addElement("Terminated", model.terminated.toString());
        model.registers.forEach(function (value, index) {
            return _this.addElement("R" + index, value.toString(2));
        });
    };
    return ProcessorView;
}());
