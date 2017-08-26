var model = new ProcessorModel();
var stateNode = document.getElementById("state");
var view = new ProcessorView(stateNode, model);
var helper = new CommandHelper(model);
var table = document.getElementById("commandHelp");
var helpView = new HelpView(table, helper);
var program = document.getElementById("programInput");
var process = document.getElementById("processBtn");
var next = document.getElementById("nextBtn");
var controller = new ProcessorController(model, helper, program, process, next);
