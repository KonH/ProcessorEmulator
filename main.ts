var model = new ProcessorModel();

var stateNode = document.getElementById("state");
var memInput = Utils.getTextArea("memoryInput");
var view = new ProcessorView(stateNode, memInput, model);

var helper = new CommandHelper(model);

var table = Utils.getTable("commandHelp");
var helpView = new HelpView(table, helper);

var assemblyCode = Utils.getTextArea("assemblyInput");
var machineCode = Utils.getTextArea("machineInput");
var convert = Utils.getButton("convertBtn");
var assemblyController = new AssemblyController(assemblyCode, machineCode, convert, helper);

var process = Utils.getButton("processBtn");
var next = Utils.getButton("nextBtn");
var auto = Utils.getButton("autoBtn");
var procController = new ProcessorController(model, helper, machineCode, memInput, process, next, auto);

var save = new SaveModel();
var saveNameInput = Utils.getInput("saveName");
var saveButton = Utils.getButton("saveBtn");
var saveController = new SaveController(save, assemblyController, saveNameInput, saveButton);
var saveRoot = document.getElementById("saveContent");
var saveView = new SaveView(save, assemblyController, saveRoot);