var HelpView = (function () {
    function HelpView(table, helper) {
        this.table = table;
        this.helper = helper;
        this.write();
    }
    HelpView.prototype.write = function () {
        var _this = this;
        this.helper.handlersByName.forEach(function (item) { return _this.writeItem(item); });
    };
    HelpView.prototype.getTdText = function (text) {
        return "<td>" + text + "</td>";
    };
    HelpView.prototype.getBoldTdText = function (text) {
        return this.getTdText("<b>" + text + "</b>");
    };
    HelpView.prototype.getArgText = function (index, size) {
        return " " + HelpView.ArgNames[index] + ":" + size;
    };
    HelpView.prototype.getFullHeaderText = function (item) {
        var header = item.header.toString(2);
        while (header.length < Command.headerSize) {
            header = "0" + header;
        }
        var args = "";
        var shortSize = Command.shortArgSize;
        for (var i = 0; i < item.shortArgs; i++) {
            args += this.getArgText(i, shortSize);
        }
        var wideSize = Command.wideArgSize;
        for (var i = 0; i < item.wideArgs; i++) {
            args += this.getArgText(item.shortArgs + i, wideSize);
        }
        return this.getBoldTdText(header + args);
    };
    HelpView.prototype.writeItem = function (item) {
        var content = "";
        content += this.getBoldTdText(item.name);
        content += this.getFullHeaderText(item);
        content += this.getTdText(item.description);
        var child = document.createElement("tr");
        child.innerHTML = content;
        this.table.appendChild(child);
    };
    HelpView.ArgNames = ["x", "y", "z", "w"];
    return HelpView;
}());
