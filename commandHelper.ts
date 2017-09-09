class CommandHelper {
	handlersByHeader : Map<number, HandlerBase> = new Map<number, HandlerBase>();
	handlersByName : Map<string, HandlerBase> = new Map<string, HandlerBase>();
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
			new JumpEqualHandler(),
			new LoadHandler(),
			new SaveHandler(),
			new LoadByRegHandler(),
			new SaveByRegHandler(),
			new AddHandler(),
			new PutHandler(),
			new AddAccHandler(),
			new AccMoveHandler(),
			new LoadByAccRegHandler(),
			new SaveByAccRegHandler()
		]);
	}

	private addHandlers(handlers : HandlerBase[]) {
		handlers.forEach(handler => this.addHandler(handler));
	}

	private addHandler(handler : HandlerBase) {
		if(this.handlersByHeader.has(handler.header)) {
			throw "Duplicate command (" + handler.header.toString(2) + ")!";
		}
		this.handlersByHeader.set(handler.header, handler);
		this.handlersByName.set(handler.name.toLowerCase(), handler);
	}

	private loadCommandDataWide(command : Command, count : number) {
		let data = this.model.readBusData(true, count * Setup.wideArgSize);
		command.loadWideArgs(data, count);
	}

	private loadCommandDataShort(command : Command, count : number) {
		let data = this.model.readBusData(true, count * Setup.shortArgSize);
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

	private findHandler(key, collection) {
		if (collection.has(key)) {
			return collection.get(key);
		}
		return null;
	}

	private findHandlerByHeader(header : number) : HandlerBase {
		return this.findHandler(header, this.handlersByHeader);
	}

	findHandlerByName(name : string) : HandlerBase {
		return this.findHandler(name.toLowerCase(), this.handlersByName);
	}

	execCommand(command : Command) {
		let header = command.header;
		let handler = this.findHandlerByHeader(header.toNum());
		if (handler != null) {
			this.prepare(command, handler.name, handler.shortArgs, handler.wideArgs);
			handler.exec(command, model);
		}
	}
}