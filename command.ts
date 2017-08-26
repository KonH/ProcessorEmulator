class Command {
	static headerSize = 4;
	static shortArgSize = 2;
	static wideArgSize = 8;

	name : string = "UNK";

	header : BitSet;
	args : BitSet[] = [];

	constructor(header : BitSet) {
		this.header = header;
	}

	private loadArgsBySize(data : BitSet, count : number, size : number) {
		for (var i = 0; i < count; i++) {
			let set = data.subset(i * size, size);
			this.args.push(set);
		}
	}

	loadShortArgs(data : BitSet, count : number) {
		Logger.write("command", "loadShortArgs: " + data + ", " + count);
		this.loadArgsBySize(data, count, Command.shortArgSize);
	}

	loadWideArgs(data : BitSet, count : number) {
		Logger.write("command", "loadWideArgs: " + data + ", " + count);
		this.loadArgsBySize(data, count, Command.wideArgSize);
	}

	toString() : string {
		let line = "";
		this.args.forEach((value) => {
			line += value + ";";
		});
		return "CMD: " + this.header + " (" + this.name + ") ARGS: [" + line + "]";
	}
}