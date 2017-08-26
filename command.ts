class Command {
	static headerSize = 4;
	static shortArgSize = 2;
	static wideArgSize = 4;

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

	loadArgsBySize(data : string, count : number, size : number) {
		let bodyData = this.toBitArray(data);
		for (var i = 0; i < count; i++) {
			this.args.push(this.extractNum(bodyData,  i * size, size));
		}
	}

	loadShortArgs(data : string, count : number) {
		Logger.write("command", "loadShortArgs: " + data + ", " + count);
		this.loadArgsBySize(data, count, Command.shortArgSize);
	}

	loadWideArgs(data : string, count : number) {
		Logger.write("command", "loadWideArgs: " + data + ", " + count);
		this.loadArgsBySize(data, count, Command.wideArgSize);
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