class ArgHolder {
	rawValue : string;
	readyValue : number;
	size : number;

	constructor(rawValue : string, size : number) {
		this.rawValue = rawValue;
		this.size = size;
	}
}

class AssemblyHolder {
	handler : HandlerBase;
	argHolders : ArgHolder[] = [];
	mark : string;
	fullSize : number;

	constructor(mark : string, handler : HandlerBase, args : string[]) {
		this.mark = mark;
		this.handler = handler;
		let argIndex = 0;
		for (var i = 0; i < this.handler.shortArgs; i++) {
			this.argHolders.push(new ArgHolder(args[argIndex], Command.shortArgSize));
			argIndex++;
		}
		for (var i = 0; i < this.handler.wideArgs; i++) {
			this.argHolders.push(new ArgHolder(args[argIndex], Command.wideArgSize));
			argIndex++;
		}
		this.fullSize = 
			Command.headerSize + 
			Command.shortArgSize * this.handler.shortArgs + 
			Command.wideArgSize * this.handler.wideArgs;
	}

	getHeader() {
		return this.handler.header;
	}
}

class AssemblyController {
	static InputRadix : number = 10;

	private assemblyInput : HTMLTextAreaElement;
	private machineCodeInput : HTMLTextAreaElement;
	private generateButton : HTMLButtonElement;
	private helper : CommandHelper;

	private holders : AssemblyHolder[];

	constructor(
		assembly : HTMLTextAreaElement, machine : HTMLTextAreaElement, generate : HTMLButtonElement, helper : CommandHelper) 
	{
		this.assemblyInput = assembly;
		this.machineCodeInput = machine;
		this.generateButton = generate;
		this.generateButton.onclick = () => this.generateMachineCode(this.assemblyInput.value);
		this.helper = helper;
	}

	private generateMachineCode(assemblyCode : string) {
		let lines = assemblyCode.split('\n');
		this.holders = this.createHolders(lines);
		this.setupAllArgValues(this.holders);
		let machineCode = this.getMachineCode(this.holders);
		this.machineCodeInput.value = machineCode;
	}

	private createHolders(lines : string[]) : AssemblyHolder[] {
		let holders : AssemblyHolder[] = [];
		lines.forEach(line => {
			let holder = this.convertLine(line);
			if	(holder != null) {
				holders.push(holder);
			}
		});
		return holders;
	}

	findMark(name : string) : string {
		if (name.endsWith(":")) {
			return name.replace(":", "");
		}
		return null;
	}

	convertLine(line : string) : AssemblyHolder {
		let parts = line.split(' ');
		Logger.write("assemblyController", "line parts: " + parts);
		if (parts.length > 0) {
			let name : string;
			let args : string[];
			let mark = this.findMark(parts[0]);
			let hasMark = (mark != null);
			name = parts[hasMark ? 1 : 0];
			args = parts.splice(hasMark ? 2 : 1);
			return this.createHolder(mark, name, args);
		}
		return null;
	}

	private createHolder(mark : string, name : string, args : string[]) : AssemblyHolder {
		Logger.write("assemblyController", "createCommand from '" + name + "', " + args);
		let handler = this.helper.findHandlerByName(name);
		if (handler != null) {
			let argCount = handler.shortArgs + handler.wideArgs;
			if (args.length == argCount ) {
				Logger.write("assemblyController", "new holder: '" + mark + "', '" + name + "', " + args);
				return new AssemblyHolder(mark, handler, args);
			} else {
				Logger.write("assemblyController", "wrong arg count: " + args.length + ", but " + argCount + " expected");
			}
		} else {
			Logger.write("assemblyController", "unknown command: '" + name + "'");
		}
		return null;
	}

	private setupAllArgValues(holders : AssemblyHolder[]) {
		holders.forEach(holder => {
			this.setupArgValues(holder);
		});
	}

	private setupArgValues(holder : AssemblyHolder) {
		holder.argHolders.forEach(item => this.setupArgValue(item));
	}

	private parseInt(value : string) : number {
		return parseInt(value, AssemblyController.InputRadix);
	}

	private getRegisterAddrByName(name : string) : number {
		return this.parseInt(name.slice(1)) - 1;
	}

	private tryConvertRegisterAlias(arg : ArgHolder) : boolean {
		let value = arg.rawValue;
		if (value.startsWith("%")) {
			arg.readyValue = this.getRegisterAddrByName(value);
			return true;
		}
		return false;
	}

	private isHolderWithMark(holder : AssemblyHolder, name : string) {
		return (holder.mark == name);
	}

	private findCommandAddr(name : string) : number {
		let index = 0;
		for (var i = 0; i < this.holders.length; i++) {
			let item = this.holders[i];
			if (this.isHolderWithMark(item, name)) {
				Logger.write("assemblyController", "addr for '" + name + "' is " + index);
				return index;
			}
			index += item.fullSize;
		}
		Logger.write("assemblyController", "can't find mark by name '" + name + "'");
		return 0;
	}

	private tryConvertMarkAlias(arg : ArgHolder) : boolean {
		let value = arg.rawValue;
		if (value.startsWith("$")) {
			arg.readyValue = this.findCommandAddr(value.substr(1));
			return true;
		}
		return false;
	}

	private setupArgValue(arg : ArgHolder) {
		if (!this.tryConvertRegisterAlias(arg) && !this.tryConvertMarkAlias(arg)) {
			arg.readyValue = this.parseInt(arg.rawValue);
		}
	}

	private toProperCodeString(value : number, len : number) : string {
		let str = value.toString(2);
		while (str.length < len) {
			str = "0" + str;
		}
		return str;
	}

	private convertArgs(args : ArgHolder[]) : string {
		let str = "";
		args.forEach(arg => {
			let argValue = this.toProperCodeString(arg.readyValue, arg.size);
			argValue += " ";
			str += argValue;
		});
		return str;
	}

	private getMachineCode(holders : AssemblyHolder[]) : string {
		let machineCode = "";
		holders.forEach(holder => {
			machineCode += this.toProperCodeString(holder.getHeader(), Command.headerSize);
			machineCode += " ";
			machineCode += this.convertArgs(holder.argHolders);
			machineCode += "  ";
		});
		return machineCode;
	}
}