var Command = (function () {
    function Command(cmd) {
        this.body = [];
        this.cmd = 0;
        this.name = "UNK";
        this.args = [];
        for (var i = 0; i < 10; i++) {
            this.body[i] = cmd.length > i ? parseInt(cmd[i]) : 0;
        }
        this.cmd = this.extractNum(0, 2);
        this.args = [];
        for (var i = 0; i < 2; i++) {
            this.args.push(this.extractNum(2 + i * 2, 2));
        }
    }
    Command.prototype.extractNum = function (start, len) {
        var parts = this.body.slice(start, start + len);
        var value = 0;
        for (var i = 0; i < len; i++) {
            var cur = (parts[len - i - 1]) * Math.pow(2, i);
            value += cur;
        }
        return value;
    };
    Command.prototype.format = function () {
        var line = "";
        this.args.forEach(function (value) {
            line += value.toString(2) + ";";
        });
        return "CMD: " + this.cmd.toString(2) + " (" + this.name +
            ") ARGS: [" + line + "]";
    };
    return Command;
}());
var ProcessorController = (function () {
    function ProcessorController() {
        var _this = this;
        this.regs = [0, 0, 0, 0];
        this.stateNode = document.getElementById("state");
        this.programInput =
            document.getElementById("programInput");
        this.processButton =
            document.getElementById("processBtn");
        this.processButton.onclick = function () { return _this.onProcess(); };
        this.nextButton =
            document.getElementById("nextBtn");
        this.nextButton.onclick = function () { return _this.onNext(); };
        this.resetState();
        this.writeStateView();
    }
    ProcessorController.prototype.resetState = function () {
        this.program = [];
        this.counter = -1;
        this.current = null;
        this.regs = [0, 0, 0, 0];
        this.terminated = true;
    };
    ProcessorController.prototype.readProgram = function () {
        var _this = this;
        var text = this.programInput.value;
        var textParts = text.split(" ");
        textParts.forEach(function (item) {
            var intValue = parseInt(item, 2);
            if (!isNaN(intValue)) {
                _this.program.push(item);
            }
        });
    };
    ProcessorController.prototype.onProcess = function () {
        this.resetState();
        this.terminated = false;
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
                this.reset(this.current);
                break;
            case 2:
                this.inc(this.current);
                break;
            case 3:
                this.put(this.current);
                break;
        }
    };
    ProcessorController.prototype.reset = function (cmd) {
        cmd.name = "RESET";
        this.regs[cmd.args[0]] = 0;
    };
    ProcessorController.prototype.inc = function (cmd) {
        cmd.name = "INC";
        this.regs[cmd.args[0]]++;
    };
    ProcessorController.prototype.put = function (cmd) {
        cmd.name = "PUT";
        this.regs[cmd.args[0]] = cmd.args[1];
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
            var s = value + "; ";
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
        var _this = this;
        this.clearStateView();
        this.addToStateView("Program", this.formatProgram());
        this.addToStateView("Current", this.formatCommand());
        this.addToStateView("Counter", this.counter.toString());
        this.addToStateView("Terminated", this.terminated.toString());
        this.regs.forEach(function (value, index) {
            return _this.addToStateView("R" + index, value.toString(2));
        });
    };
    return ProcessorController;
}());
var procController = new ProcessorController();
