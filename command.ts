class Command {
	body : number[] = [];
	cmd : number = 0;
	name : string = "UNK";
	args : number[] = [];

	constructor(cmd : string) {
		for (var i = 0; i < 10; i++) {
			this.body[i] = cmd.length > i ? parseInt(cmd[i]) : 0;
		}
		this.cmd = this.extractNum(0, 2);
		this.args = [];
		for (var i = 0; i < 2; i++) {
			this.args.push(this.extractNum(2 + i * 2, 2));
		}
	}

	extractNum(start : number, len : number) : number { 
		let parts = this.body.slice(start, start + len);
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
		return "CMD: " + this.cmd.toString(2) + " (" + this.name + 
		") ARGS: [" + line + "]";
	}
}