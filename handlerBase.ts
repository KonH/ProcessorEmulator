abstract class HandlerBase {
	protected static accRegIdx = 0;

	abstract header : number;
	abstract name : string;
	abstract description : string;
	shortArgs : number = 0;
	wideArgs : number = 0;

	abstract exec(cmd : Command, model : ProcessorModel);
}

abstract class MoveHandlerBase extends HandlerBase {
	protected commonMove(model : ProcessorModel, fromIdx : number, toIdx : number) {
		let fromValue = model.registers[fromIdx];
		model.setRegister(toIdx, fromValue);
	}
}