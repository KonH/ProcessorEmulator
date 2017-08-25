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
