class BitSet {
	private values:boolean[] = [];

	constructor(size : number) {
		this.values = Array(size).fill(false);
	}

	toString() : string {
		let str = "";
		this.values.forEach(item => str += item ? "1" : "0");
		return str;
	}

	toNum() : number {
		let num = 0;
		let values = this.values;
		for (var i = 0; i < values.length; i++) {
			if (values[values.length - i - 1]) { 
				num += Math.pow(2, i);
			}
		}
		return num;
	}

	getSize() : number {
		return this.values.length;
	}

	getBit(index : number) : boolean {
		return this.values[index];
	}

	private clone() : BitSet {
		return BitSet.fromNum(this.toNum(), this.getSize());
	}

	subset(start : number, len : number) : BitSet {
		Logger.write("BitSet", "subset: " + start + ":" + len + " (" + this.getSize() + ")");
		let set = new BitSet(len);
		for (var i = start; i < start + len; i++) {
			set.values[i - start] = this.values[i];
		}
		return set;
	}

	setValue(value : number) : BitSet {
		let len = this.values.length;
		return BitSet.fromString(value.toString(2), len);
	}

	setOneBit(index : number, value : boolean) : BitSet {
		var newSet = this.clone();
		newSet.values[index] = value;
		return newSet;
	}

	addValue(value : number) : BitSet {
		let newValue = this.toNum() + value;
		return BitSet.fromNum(newValue, this.getSize());
	}

	private static setValuesFromString(str : string, values : boolean[]) {
		for (var i = 0; i < str.length; i++) {
			values[i] = parseInt(str[i]) == 1;
		}
	}

	static fromString(str : string, size : number) : BitSet {
		while (str.length > size) {
			str = str.substr(1);
		}
		while (str.length < size) {
			str = "0" + str;
		}
		let set = new BitSet(str.length);
		BitSet.setValuesFromString(str, set.values);
		return set;
	}

	static fromNum(num : number, size : number) : BitSet {
		return BitSet.fromString(num.toString(2), size);
	}

	static empty(size : number) : BitSet {
		return BitSet.fromNum(0, size);
	}
}