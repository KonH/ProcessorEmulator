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

	constructor(handler : HandlerBase, args : string[]) {
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
		let holders = this.createHolders(lines);
		this.setupAllArgValues(holders);
		let machineCode = this.getMachineCode(holders);
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

	convertLine(line : string) : AssemblyHolder {
		let parts = line.split(' ');
		Logger.write("assemblyController", "line parts: " + parts);
		if (parts.length > 0) {
			var name = parts[0];
			var args = parts.splice(1);
			return this.createHolder(name, args);
		}
		return null;
	}

	private createHolder(name : string, args : string[]) : AssemblyHolder {
		Logger.write("assemblyController", "createCommand from '" + name + "', " + args);
		let handler = this.helper.findHandlerByName(name);
		if (handler != null) {
			let argCount = handler.shortArgs + handler.wideArgs;
			if (args.length == argCount ) {
				return new AssemblyHolder(handler, args);
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

	private tryConvertRegisterAbbr(arg : ArgHolder) : boolean {
		let value = arg.rawValue;
		if (value.startsWith("%")) {
			arg.readyValue = this.getRegisterAddrByName(value);
			return true;
		}
		return false;
	}

	private setupArgValue(arg : ArgHolder) {
		if(!this.tryConvertRegisterAbbr(arg)) {
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