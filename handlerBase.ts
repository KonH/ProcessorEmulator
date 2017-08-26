abstract class HandlerBase {
	protected static accRegIdx = 0;

	abstract header : number;
	abstract name : string;
	abstract description : string;
	shortArgs : number = 0;
	wideArgs : number = 0;

	abstract exec(cmd : Command, model : ProcessorModel);
}