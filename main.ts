var model = new ProcessorModel();

var stateNode = document.getElementById("state");
var memInput = <HTMLTextAreaElement>document.getElementById("memoryInput");
var view = new ProcessorView(stateNode, memInput, model);

var helper = new CommandHelper(model);

var table = <HTMLTableElement>document.getElementById("commandHelp");
var helpView = new HelpView(table, helper);

var assemblyCode = <HTMLTextAreaElement>document.getElementById("assemblyInput");
var machineCode = <HTMLTextAreaElement>document.getElementById("machineInput");
var convert = <HTMLButtonElement>document.getElementById("convertBtn");
var assemblyController = new AssemblyController(assemblyCode, machineCode, convert, helper);

var process = <HTMLButtonElement>document.getElementById("processBtn");
var next = <HTMLButtonElement>document.getElementById("nextBtn");
var auto = <HTMLButtonElement>document.getElementById("autoBtn");
var procController = new ProcessorController(model, helper, machineCode, memInput, process, next, auto);