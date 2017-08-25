class Command {
	static headerSize = 2;
	static argSize = 2;

	body : number[] = [];
	header : number = 0;
	name : string = "UNK";
	args : number[] = [];

	constructor(header : string) {
		let headerData = this.toBitArray(header);
		this.header = this.extractNum(headerData, 0, Command.headerSize);
	}

	toBitArray(str : string) {
		let array = [];
		for (var i = 0; i < str.length; i++) {
			array.push(parseInt(str[i]));
		}
		return array;
	}

	loadArgs(data : string, count : number) {
		let bodyData = this.toBitArray(data);
		for (var i = 0; i < count; i++) {
			this.args.push(this.extractNum(bodyData,  i * Command.argSize, Command.argSize));
		}
	}

	extractNum(data : number[], start : number, len : number) : number { 
		let parts = data.slice(start, start + len);
		let value = 0;
		for (var i = 0; i < len; i++) {
			let cur = (parts[len - i - 1]) * Math.pow(2, i);
			value += cur;
		}
		return value;
	}

	format() : string {
		let line = "";
		this.args.forEach((value) => {
			line += value.toString(2) + ";";
		});
		return "CMD: " + this.header.toString(2) + " (" + this.name + 
		") ARGS: [" + line + "]";
	}
}