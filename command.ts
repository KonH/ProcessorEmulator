class Command {
	name : string = "UNK";

	header : BitSet;
	args : BitSet[] = [];

	constructor(header : BitSet) {
		this.header = header;
	}

	private loadArgsBySize(data : BitSet, count : number, size : number) {
		for (var i = 0; i < count; i++) {
			let set = data.subset(true, i * size, size);
			Logger.write("command", "loadArgsBySize: loaded set: " + set.toStringComplex());
			this.args.push(set);
		}
	}

	loadShortArgs(data : BitSet, count : number) {
		Logger.write("command", "loadShortArgs: " + data + ", " + count);
		this.loadArgsBySize(data, count, Setup.shortArgSize);
	}

	loadWideArgs(data : BitSet, count : number) {
		Logger.write("command", "loadWideArgs: " + data + ", " + count);
		this.loadArgsBySize(data, count, Setup.wideArgSize);
	}

	toString() : string {
		let line = "";
		this.args.forEach((value) => {
			line += value + ";";
		});
		return "CMD: " + this.header + " (" + this.name + ") ARGS: [" + line + "]";
	}
}