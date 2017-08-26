class AssemblyController {
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
		let machineCode = "";
		let lines = assemblyCode.split('\n');
		lines.forEach(line => machineCode += this.convertLine(line));
		this.machineCodeInput.value = machineCode;
	}

	convertLine(line : string) : string {
		let parts = line.split(' ');
		Logger.write("assemblyController", "line parts: " + parts);
		if (parts.length > 0) {
			var name = parts[0];
			var args = parts.splice(1);
			return this.createCommand(name, args);
		}
		return "";
	}

	createCommand(name : string, args : string[]) : string {
		Logger.write("assemblyController", "createCommand from '" + name + "', " + args);
		let handler = this.helper.findHandlerByName(name);
		if (handler != null) {
			let text = "";
			text += handler.header.toString(2) + " ";
			let argCount = handler.shortArgs + handler.wideArgs;
			if (args.length == argCount ) {
				args.forEach(arg => 
					text += arg + " "
				);
				text += "	";
				return text;	
			} else {
				Logger.write("assemblyController", "wrong arg count: " + args.length + ", but " + argCount + " expected");
			}
		} else {
			Logger.write("assemblyController", "unknown command: '" + name + "'");
		}
		return "";
	}
}