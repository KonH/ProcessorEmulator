var Command = (function () {
    function Command(header) {
        this.name = "UNK";
        this.args = [];
        this.header = header;
    }
    Command.prototype.loadArgsBySize = function (data, count, size) {
        for (var i = 0; i < count; i++) {
            var set = data.subset(i * size, size);
            this.args.push(set);
        }
    };
    Command.prototype.loadShortArgs = function (data, count) {
        Logger.write("command", "loadShortArgs: " + data + ", " + count);
        this.loadArgsBySize(data, count, Setup.shortArgSize);
    };
    Command.prototype.loadWideArgs = function (data, count) {
        Logger.write("command", "loadWideArgs: " + data + ", " + count);
        this.loadArgsBySize(data, count, Setup.wideArgSize);
    };
    Command.prototype.toString = function () {
        var line = "";
        this.args.forEach(function (value) {
            line += value + ";";
        });
        return "CMD: " + this.header + " (" + this.name + ") ARGS: [" + line + "]";
    };
    return Command;
}());
