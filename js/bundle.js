var Command = (function () {
    function Command(fullCmd) {
        this.body = [];
        this.cmd = 0;
        this.name = "UNK";
        this.arg1 = 0;
        for (var i = 0; i < 4; i++) {
            this.body[i] = (fullCmd >> i) & 1;
        }
        this.cmd = this.extractNum(0, 2);
        this.arg1 = this.extractNum(2, 2);
    }
    Command.prototype.extractNum = function (start, len) {
        var parts = this.body.slice(start, start + len);
        parts = parts.reverse();
        var value = 0;
        for (var i = 0; i < len; i++) {
            var cur = (parts[len - i - 1]) * Math.pow(2, i);
            value += cur;
        }
        return value;
    };
    Command.prototype.format = function () {
        return "CMD: " + this.cmd.toString(2) + " (" + this.name + ") ARG1: " + this.arg1.toString(2);
    };
    return Command;
}());
var ProcessorController = (function () {
    function ProcessorController() {
        var _this = this;
        this.program = [];
        this.counter = -1;
        this.current = null;
        this.terminated = true;
        this.r1 = 0;
        this.stateNode = document.getElementById("state");
        this.programInput =
            document.getElementById("programInput");
        this.processButton =
            document.getElementById("processBtn");
        this.processButton.onclick = function () { return _this.onProcess(); };
        this.nextButton =
            document.getElementById("nextBtn");
        this.nextButton.onclick = function () { return _this.onNext(); };
        this.writeStateView();
    }
    ProcessorController.prototype.resetState = function () {
        this.current = null;
        this.program = [];
        this.counter = -1;
        this.r1 = 0;
    };
    ProcessorController.prototype.readProgram = function () {
        var _this = this;
        var text = this.programInput.value;
        var textParts = text.split(" ");
        textParts.forEach(function (item) {
            var intValue = parseInt(item, 2);
            if (!isNaN(intValue)) {
                _this.program.push(intValue);
            }
        });
    };
    ProcessorController.prototype.onProcess = function () {
        this.terminated = false;
        this.resetState();
        this.readProgram();
        this.writeStateView();
    };
    ProcessorController.prototype.onNext = function () {
        this.checkTermination();
        if (!this.terminated) {
            this.processCurrent();
        }
        this.writeStateView();
    };
    ProcessorController.prototype.updateCurrent = function () {
        this.counter++;
        this.current = new Command(this.program[this.counter]);
        return this.current;
    };
    ProcessorController.prototype.processCurrent = function () {
        this.updateCurrent();
        switch (this.current.cmd) {
            case 1:
                this.reset();
                break;
            case 2:
                this.inc();
                break;
            case 3:
                this.load();
                break;
        }
    };
    ProcessorController.prototype.reset = function () {
        this.current.name = "RESET";
        this.r1 = 0;
    };
    ProcessorController.prototype.inc = function () {
        this.current.name = "INC";
        this.r1++;
    };
    ProcessorController.prototype.load = function () {
        this.current.name = "LOAD";
        this.r1 = this.current.arg1;
    };
    ProcessorController.prototype.checkTermination = function () {
        if (this.counter + 1 >= this.program.length) {
            this.terminated = true;
        }
    };
    ProcessorController.prototype.clearStateView = function () {
        var node = this.stateNode;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };
    ProcessorController.prototype.addToStateView = function (name, value) {
        var childNode = document.createElement("li");
        childNode.innerHTML = "<b>" + name + "</b>: " + value;
        this.stateNode.appendChild(childNode);
    };
    ProcessorController.prototype.formatProgram = function () {
        var _this = this;
        var str = "";
        this.program.forEach(function (value, index) {
            var s = value.toString(2) + "; ";
            if (index == _this.counter) {
                s = "<b>" + s + "</b>";
            }
            str += s;
        });
        return str;
    };
    ProcessorController.prototype.formatCommand = function () {
        if (this.current == null) {
            return "none";
        }
        return this.current.format();
    };
    ProcessorController.prototype.writeStateView = function () {
        this.clearStateView();
        this.addToStateView("Program", this.formatProgram());
        this.addToStateView("Current", this.formatCommand());
        this.addToStateView("Counter", this.counter.toString());
        this.addToStateView("Terminated", this.terminated.toString());
        this.addToStateView("R1", this.r1.toString(2));
    };
    return ProcessorController;
}());
var procController = new ProcessorController();
