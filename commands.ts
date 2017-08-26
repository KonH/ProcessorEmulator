abstract class HandlerBase {
	protected static accRegIdx = 0;

	abstract header : number;
	abstract name : string;
	shortArgs : number = 0;
	wideArgs : number = 0;

	protected getCommonRegIdx(index : number) {
		return index + 1;
	}

	abstract exec(cmd : Command, model : ProcessorModel);
}

abstract class MoveHandlerBase extends HandlerBase {
	protected commonMove(model : ProcessorModel, fromIdx : number, toIdx : number) {
		let fromValue = model.registers[fromIdx];
		model.setRegister(toIdx, fromValue);
	}
}

class ResetHandler extends HandlerBase {
	header = 0b0001;
	name = "RST";
	shortArgs = 1;

	exec(cmd : Command, model : ProcessorModel) {
		let idx = this.getCommonRegIdx(cmd.args[0]);
		model.setRegister(idx, 0);
	}
}

class IncHandler extends HandlerBase {
	header = 0b0010;
	name = "INC";
	shortArgs = 1;

	exec(cmd : Command, model : ProcessorModel) {
		let index = this.getCommonRegIdx(cmd.args[0]);
		let val = model.registers[index];
		model.setRegister(index, ++val);
	}
}

class MoveHandler extends MoveHandlerBase {
	header = 0b0011;
	name = "MOV";
	shortArgs = 2;

	exec(cmd : Command, model : ProcessorModel) {
		let fromIdx = this.getCommonRegIdx(cmd.args[0]);
		let toIdx = this.getCommonRegIdx(cmd.args[1]); 
		this.commonMove(model, fromIdx, toIdx);
	}
}

class ResetAccHandler extends HandlerBase {
	header = 0b0100;
	name = "RSTA";

	exec(cmd : Command, model : ProcessorModel) {
		model.setRegister(HandlerBase.accRegIdx, 0);
	}
}

class IncAccHandler extends HandlerBase {
	header = 0b0101;
	name = "INCA";

	exec(cmd : Command, model : ProcessorModel) {
		let idx = HandlerBase.accRegIdx;
		let val = model.registers[idx];
		model.setRegister(idx, ++val);
	}
}

class MoveAccHandler extends MoveHandlerBase {
	header = 0b0110;
	name = "MOVA";
	shortArgs = 1;

	exec(cmd : Command, model : ProcessorModel) {
		let fromIdx = this.getCommonRegIdx(cmd.args[0]);
		this.commonMove(model, fromIdx, HandlerBase.accRegIdx);
	}
}

class JumpHandler extends HandlerBase {
	header = 0b0111;
	name = "JMP";
	wideArgs = 1;

	exec(cmd : Command, model : ProcessorModel) {
		model.setCounter(cmd.args[0]);
	}
}

class JumpZeroHandler extends HandlerBase {
	header = 0b1000;
	name = "JMZ";
	shortArgs = 1;
	wideArgs = 1;

	exec(cmd : Command, model : ProcessorModel) {
		let idx = this.getCommonRegIdx(cmd.args[0]);
		let condition = model.registers[idx] == 0;
		if (condition) {
			model.setCounter(cmd.args[1]);
		}
	}
}

class JumpEqualHandler extends HandlerBase {
	header = 0b1001;
	name = "JME";
	shortArgs = 2;
	wideArgs = 1;

	exec(cmd : Command, model : ProcessorModel) {
		let leftIdx = this.getCommonRegIdx(cmd.args[0]);
		let rightIdx = this.getCommonRegIdx(cmd.args[0]);
		let registers = model.registers;
		let condition = registers[leftIdx] == registers[rightIdx];
		if (condition) {
			model.setCounter(cmd.args[0]);
		}
	}
}

class CommandHelper {
	commands : Map<number, HandlerBase> = new Map<number, HandlerBase>();
	model : ProcessorModel;

	constructor(model : ProcessorModel) {
		this.model = model;
		this.addHandlers([
			new ResetHandler(),
			new IncHandler(),
			new MoveHandler(),
			new ResetAccHandler(),
			new IncAccHandler(),
			new MoveAccHandler(),
			new JumpHandler(),
			new JumpZeroHandler(),
			new JumpEqualHandler()
		]);
	}

	private addHandlers(handlers : HandlerBase[]) {
		handlers.forEach(handler => this.addHandler(handler));
	}

	private addHandler(handler : HandlerBase) {
		let key = handler.header;
		this.commands.set(key, handler);
	}

	private loadCommandDataWide(command : Command, count : number) {
		let data = this.model.readBusData(count * Command.wideArgSize);
		command.loadWideArgs(data, count);
	}

	private loadCommandDataShort(command : Command, count : number) {
		let data = this.model.readBusData(count * Command.shortArgSize);
		command.loadShortArgs(data, count);
	}

	private prepare(command : Command, name : string, shortArgs : number, wideArgs : number) {
		Logger.write(
			"commandHelper", 
			"prepareCommand: " + name + ", short: " + shortArgs + ", wide: " + wideArgs);
		command.name = name;
		if (shortArgs > 0) {
			this.loadCommandDataShort(command, shortArgs);
		}
		if (wideArgs > 0) {
			this.loadCommandDataWide(command, wideArgs);
		}
	}

	private findHandler(header : number) {
		if (this.commands.has(header)) {
			return this.commands.get(header);
		}
		return null;
	}

	execCommand(command : Command) {
		let header = command.header;
		let handler = this.findHandler(header);
		if (handler != null) {
			this.prepare(command, handler.name, handler.shortArgs, handler.wideArgs);
			handler.exec(command, model);
		}
	}
}