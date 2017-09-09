var Setup = (function () {
    function Setup() {
    }
    Setup.headerSize = 5;
    Setup.shortArgSize = 3;
    Setup.wideArgSize = 8;
    Setup.regCount = 8;
    Setup.serviceRegCount = 3;
    Setup.regSize = 8;
    Setup.terminatedBit = 0;
    Setup.memorySize = 128;
    return Setup;
}());
var Utils = (function () {
    function Utils() {
    }
    Utils.getTextArea = function (id) {
        return document.getElementById(id);
    };
    Utils.getTable = function (id) {
        return document.getElementById(id);
    };
    Utils.getButton = function (id) {
        return document.getElementById(id);
    };
    Utils.getInput = function (id) {
        return document.getElementById(id);
    };
    Utils.clearChilds = function (node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };
    return Utils;
}());
var BitSet = (function () {
    function BitSet(signed, size) {
        this.signed = false;
        this.values = [];
        this.signed = signed;
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
        return (this.signed ? "(S) " : "(U) ") + this.toString() + " (" + this.toNum() + ")";
    };
    BitSet.prototype.inverseBits = function (values) {
        var inversedValues = [];
        values.forEach(function (value, index) {
            inversedValues.push(!values[index]);
        });
        return inversedValues;
    };
    BitSet.prototype.toNum = function () {
        var num = 0;
        var values = this.signed ? this.values.slice(1) : this.values;
        var negative = false;
        if (this.signed && this.values[0]) {
            values = this.inverseBits(values);
            negative = true;
        }
        for (var i = 0; i < values.length; i++) {
            if (values[values.length - i - 1]) {
                num += Math.pow(2, i);
            }
        }
        return negative ? -num : num;
    };
    BitSet.prototype.getSize = function () {
        return this.values.length;
    };
    BitSet.prototype.getBit = function (index) {
        return this.values[index];
    };
    BitSet.prototype.clone = function () {
        var newSet = new BitSet(this.signed, this.getSize());
        for (var i = 0; i < this.values.length; i++) {
            newSet.values[i] = this.values[i];
        }
        return newSet;
    };
    BitSet.prototype.subset = function (signed, start, len) {
        Logger.write("BitSet", "subset: " + start + ":" + len + " (" + this.getSize() + ")");
        var set = new BitSet(signed, len);
        for (var i = start; i < start + len; i++) {
            set.values[i - start] = this.values[i];
        }
        return set;
    };
    BitSet.prototype.setValue = function (value) {
        var len = this.values.length;
        var safeStr = BitSet.getSafeStr(this.signed, value, len);
        return BitSet.fromString(this.signed, safeStr, len);
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
        return BitSet.fromNum(this.signed, newValue, this.getSize());
    };
    BitSet.setValuesFromString = function (str, values) {
        for (var i = 0; i < str.length; i++) {
            values[i] = parseInt(str[i]) == 1;
        }
    };
    BitSet.fromString = function (signed, str, size) {
        if (str.length != size) {
            throw "Wrong size: expected: " + size + ", got " + str.length;
        }
        var set = new BitSet(signed, str.length);
        BitSet.setValuesFromString(str, set.values);
        return set;
    };
    BitSet.inverseStr = function (str) {
        var inversedStr = "";
        for (var i = 0; i < str.length; i++) {
            inversedStr += str[i] == "0" ? "1" : "0";
        }
        return inversedStr;
    };
    BitSet.getSafeStr = function (signed, num, size) {
        var safeNum = num > 0 ? num : -num;
        var safeStr = safeNum.toString(2);
        if (signed) {
            while (safeStr.length > size - 1) {
                safeStr = safeStr.substr(1);
            }
            while (safeStr.length < size - 1) {
                safeStr = "0" + safeStr;
            }
            if (num < 0) {
                safeStr = BitSet.inverseStr(safeStr);
            }
            safeStr = (num < 0 ? "1" : "0") + safeStr;
        }
        else {
            while (safeStr.length > size) {
                safeStr = safeStr.substr(1);
            }
            while (safeStr.length < size) {
                safeStr = "0" + safeStr;
            }
        }
        return safeStr;
    };
    BitSet.fromNum = function (signed, num, size) {
        var safeStr = BitSet.getSafeStr(signed, num, size);
        return BitSet.fromString(signed, safeStr, size);
    };
    BitSet.empty = function (signed, size) {
        return BitSet.fromNum(signed, 0, size);
    };
    return BitSet;
}());
