var Setup = (function () {
    function Setup() {
    }
    Setup.headerSize = 5;
    Setup.shortArgSize = 2;
    Setup.wideArgSize = 8;
    Setup.regCount = 8;
    Setup.serviceRegCount = 3;
    Setup.regSize = 8;
    Setup.terminatedBit = 0;
    Setup.memorySize = 256;
    return Setup;
}());
var BitSet = (function () {
    function BitSet(size) {
        this.values = [];
        this.values = Array(size).fill(false);
    }
    BitSet.prototype.toString = function () {
        var str = "";
        this.values.forEach(function (item) { return str += item ? "1" : "0"; });
        return str;
    };
    BitSet.prototype.toStringLines = function (lineLen) {
        var str = "";
        var values = this.values;
        for (var i = 0; i < values.length; i++) {
            if ((i > 0) && (i % lineLen == 0)) {
                str += "\n";
            }
            str += values[i] ? "1" : "0";
        }
        return str;
    };
    BitSet.prototype.toStringComplex = function () {
        return this.toString() + " (" + this.toNum() + ")";
    };
    BitSet.prototype.toNum = function () {
        var num = 0;
        var values = this.values;
        for (var i = 0; i < values.length; i++) {
            if (values[values.length - i - 1]) {
                num += Math.pow(2, i);
            }
        }
        return num;
    };
    BitSet.prototype.getSize = function () {
        return this.values.length;
    };
    BitSet.prototype.getBit = function (index) {
        return this.values[index];
    };
    BitSet.prototype.clone = function () {
        return BitSet.fromNum(this.toNum(), this.getSize());
    };
    BitSet.prototype.subset = function (start, len) {
        Logger.write("BitSet", "subset: " + start + ":" + len + " (" + this.getSize() + ")");
        var set = new BitSet(len);
        for (var i = start; i < start + len; i++) {
            set.values[i - start] = this.values[i];
        }
        return set;
    };
    BitSet.prototype.setValue = function (value) {
        var len = this.values.length;
        return BitSet.fromString(value.toString(2), len);
    };
    BitSet.prototype.setOneBit = function (index, value) {
        var newSet = this.clone();
        newSet.values[index] = value;
        return newSet;
    };
    BitSet.prototype.setBits = function (start, content) {
        var newSet = this.clone();
        for (var i = start; i < start + content.getSize(); i++) {
            newSet.values[i] = content.values[i - start];
        }
        return newSet;
    };
    BitSet.prototype.addValue = function (value) {
        var newValue = this.toNum() + value;
        return BitSet.fromNum(newValue, this.getSize());
    };
    BitSet.setValuesFromString = function (str, values) {
        for (var i = 0; i < str.length; i++) {
            values[i] = parseInt(str[i]) == 1;
        }
    };
    BitSet.fromString = function (str, size) {
        while (str.length > size) {
            str = str.substr(1);
        }
        while (str.length < size) {
            str = "0" + str;
        }
        var set = new BitSet(str.length);
        BitSet.setValuesFromString(str, set.values);
        return set;
    };
    BitSet.fromNum = function (num, size) {
        return BitSet.fromString(num.toString(2), size);
    };
    BitSet.empty = function (size) {
        return BitSet.fromNum(0, size);
    };
    return BitSet;
}());
