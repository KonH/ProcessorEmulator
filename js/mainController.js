var MainController = (function () {
    function MainController() {
        var _this = this;
        this.program = [];
        this.counter = -1;
        this.current = 0;
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
    MainController.prototype.resetState = function () {
        this.current = 0;
        this.program = [];
        this.counter = -1;
        this.r1 = 0;
    };
    MainController.prototype.readProgram = function () {
        var _this = this;
        var text = this.programInput.value;
        var textParts = text.split(" ");
        textParts.forEach(function (item) {
            var intValue = parseInt(item);
            if (!isNaN(intValue)) {
                _this.program.push(intValue);
            }
        });
    };
    MainController.prototype.onProcess = function () {
        this.terminated = false;
        this.resetState();
        this.readProgram();
        this.writeStateView();
    };
    MainController.prototype.onNext = function () {
        this.checkTermination();
        if (!this.terminated) {
            this.processCurrent();
        }
        this.writeStateView();
    };
    MainController.prototype.updateCurrent = function () {
        this.counter++;
        this.current = this.program[this.counter];
        return this.current;
    };
    MainController.prototype.processCurrent = function () {
        this.updateCurrent();
        switch (this.current) {
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
    MainController.prototype.reset = function () {
        this.r1 = 0;
    };
    MainController.prototype.inc = function () {
        this.r1++;
    };
    MainController.prototype.load = function () {
        this.r1 = this.updateCurrent();
    };
    MainController.prototype.checkTermination = function () {
        if (this.counter + 1 >= this.program.length) {
            this.terminated = true;
        }
    };
    MainController.prototype.clearStateView = function () {
        var node = this.stateNode;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };
    MainController.prototype.addToStateView = function (name, value) {
        var childNode = document.createElement("li");
        childNode.innerHTML = "<b>" + name + "</b>: " + value;
        this.stateNode.appendChild(childNode);
    };
    MainController.prototype.formatProgram = function () {
        var _this = this;
        var str = "";
        this.program.forEach(function (value, index) {
            var s = value.toString() + "; ";
            if (index == _this.counter) {
                s = "<b>" + s + "</b>";
            }
            str += s;
        });
        return str;
    };
    MainController.prototype.writeStateView = function () {
        this.clearStateView();
        this.addToStateView("Program", this.formatProgram());
        this.addToStateView("Current", this.current.toString());
        this.addToStateView("Counter", this.counter.toString());
        this.addToStateView("Terminated", this.terminated.toString());
        this.addToStateView("R1", this.r1.toString());
    };
    return MainController;
}());
var mainController = new MainController();
