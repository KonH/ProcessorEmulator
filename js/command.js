var Command = (function () {
    function Command(header) {
        this.body = [];
        this.header = 0;
        this.name = "UNK";
        this.args = [];
        var headerData = this.toBitArray(header);
        this.header = this.extractNum(headerData, 0, Command.headerSize);
    }
    Command.prototype.toBitArray = function (str) {
        var array = [];
        for (var i = 0; i < str.length; i++) {
            array.push(parseInt(str[i]));
        }
        return array;
    };
    Command.prototype.loadArgs = function (data, count) {
        var bodyData = this.toBitArray(data);
        for (var i = 0; i < count; i++) {
            this.args.push(this.extractNum(bodyData, i * Command.argSize, Command.argSize));
        }
    };
    Command.prototype.extractNum = function (data, start, len) {
        var parts = data.slice(start, start + len);
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
        return "CMD: " + this.header.toString(2) + " (" + this.name +
            ") ARGS: [" + line + "]";
    };
    Command.headerSize = 2;
    Command.argSize = 2;
    return Command;
}());
