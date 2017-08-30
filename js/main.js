var model = new ProcessorModel();
var stateNode = document.getElementById("state");
var memInput = document.getElementById("memoryInput");
var view = new ProcessorView(stateNode, memInput, model);
var helper = new CommandHelper(model);
var table = document.getElementById("commandHelp");
var helpView = new HelpView(table, helper);
var assemblyCode = document.getElementById("assemblyInput");
var machineCode = document.getElementById("machineInput");
var convert = document.getElementById("convertBtn");
var assemblyController = new AssemblyController(assemblyCode, machineCode, convert, helper);
var process = document.getElementById("processBtn");
var next = document.getElementById("nextBtn");
var auto = document.getElementById("autoBtn");
var procController = new ProcessorController(model, helper, machineCode, memInput, process, next, auto);
var save = new SaveModel();
var saveNameInput = document.getElementById("saveName");
var saveButton = document.getElementById("saveBtn");
var saveController = new SaveController(save, assemblyController, saveNameInput, saveButton);
var saveRoot = document.getElementById("saveContent");
var saveView = new SaveView(save, saveController, saveRoot);
