class Setup {
	static headerSize = 5;
	static shortArgSize = 3;
	static wideArgSize = 8;
	static regCount = 8;
	static serviceRegCount = 3;
	static regSize = 8;
	static terminatedBit = 0;
	static memorySize = 128;
}

class Utils {
	static getTextArea(id : string) : HTMLTextAreaElement {
		return <HTMLTextAreaElement>document.getElementById(id);
	}

	static getTable(id : string) : HTMLTableElement {
		return <HTMLTableElement>document.getElementById(id);
	}

	static getButton(id : string) : HTMLButtonElement {
		return <HTMLButtonElement>document.getElementById(id);
	}

	static getInput(id : string) : HTMLInputElement {
		return <HTMLInputElement>document.getElementById(id);
	}

	static clearChilds(node : HTMLElement) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}
}

class BitSet {
	private signed:boolean = false;
	private values:boolean[] = [];

	constructor(signed : boolean, size : number) {
		this.signed = signed;
		this.values = Array(size).fill(false);
	}

	toString() : string {
		let str = "";
		this.values.forEach(item => str += item ? "1" : "0");
		return str;
	}

	toStringLines(lineLen : number) : string {
		let str = "";
		let values = this.values;
		for (var i = 0; i < values.length; i++) {
			if ((i > 0) && (i % lineLen == 0)) {
				str += "\n";
			}
			str += values[i] ? "1" : "0";
		}
		return str;
	}

	toStringComplex() : string {
		return (this.signed ? "(S) " : "(U) ") + this.toString() + " (" + this.toNum() + ")";
	}

	inverseBits(values : boolean[]) : boolean[] {
		let inversedValues = [];
		values.forEach((value, index) => {
			inversedValues.push(!values[index])
		});
		return inversedValues;
	}

	toNum() : number {
		let num = 0;
		let values = this.signed ? this.values.slice(1) : this.values;
		let negative = false;
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
	}

	getSize() : number {
		return this.values.length;
	}

	getBit(index : number) : boolean {
		return this.values[index];
	}

	private clone() : BitSet {
		let newSet = new BitSet(this.signed, this.getSize());
		for (var i = 0; i < this.values.length; i++) {
			newSet.values[i] = this.values[i];
		}
		return newSet;
	}

	subset(signed : boolean, start : number, len : number) : BitSet {
		Logger.write("BitSet", "subset: " + start + ":" + len + " (" + this.getSize() + ")");
		let set = new BitSet(signed, len);
		for (var i = start; i < start + len; i++) {
			set.values[i - start] = this.values[i];
		}
		return set;
	}

	setValue(value : number) : BitSet {
		let len = this.values.length;
		let safeStr = BitSet.getSafeStr(this.signed, value, len);
		return BitSet.fromString(this.signed, safeStr, len);
	}

	setOneBit(index : number, value : boolean) : BitSet {
		var newSet = this.clone();
		newSet.values[index] = value;
		return newSet;
	}

	setBits(start : number, content : BitSet) {
		var newSet = this.clone();
		for (var i = start; i < start + content.getSize(); i++) {
			newSet.values[i] = content.values[i - start];
		}
		return newSet;
	}

	addValue(value : number) : BitSet {
		let newValue = this.toNum() + value;
		return BitSet.fromNum(this.signed, newValue, this.getSize());
	}

	private static setValuesFromString(str : string, values : boolean[]) {
		for (var i = 0; i < str.length; i++) {
			values[i] = parseInt(str[i]) == 1;
		}
	}

	static fromString(signed : boolean, str : string, size : number) : BitSet {
		if (str.length != size) {
			throw "Wrong size: expected: " + size + ", got " + str.length;
		}
		let set = new BitSet(signed, str.length);
		BitSet.setValuesFromString(str, set.values);
		return set;
	}

	private static inverseStr(str : string) : string {
		let inversedStr = "";
		for (var i = 0; i < str.length; i++) {
			inversedStr += str[i] == "0" ? "1" : "0";
		}
		return inversedStr;
	}

	static getSafeStr(signed : boolean, num : number, size : number) {
		let safeNum = num > 0 ? num : -num;
		let safeStr = safeNum.toString(2);
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
		} else {
			while (safeStr.length > size) {
				safeStr = safeStr.substr(1);
			}
			while (safeStr.length < size) {
				safeStr = "0" + safeStr;	
			}
		}
		return safeStr;
	}

	static fromNum(signed : boolean, num : number, size : number) : BitSet {
		let safeStr = BitSet.getSafeStr(signed, num, size);
		return BitSet.fromString(signed, safeStr, size);
	}

	static empty(signed : boolean, size : number) : BitSet {
		return BitSet.fromNum(signed, 0, size);
	}
}