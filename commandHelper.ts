class CommandHelper {
	handlers : Map<number, HandlerBase> = new Map<number, HandlerBase>();
	private model : ProcessorModel;

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
		this.handlers.set(key, handler);
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
		if (this.handlers.has(header)) {
			return this.handlers.get(header);
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