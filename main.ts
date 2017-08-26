var model = new ProcessorModel();

var stateNode = document.getElementById("state");
var view = new ProcessorView(stateNode, model);

var helper = new CommandHelper(model);

var table = <HTMLTableElement>document.getElementById("commandHelp");
var helpView = new HelpView(table, helper);

var program = <HTMLTextAreaElement>document.getElementById("programInput");
var process = <HTMLButtonElement>document.getElementById("processBtn");
var next = <HTMLButtonElement>document.getElementById("nextBtn");
var controller = new ProcessorController(model, helper, program, process, next);