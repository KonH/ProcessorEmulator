var model = new ProcessorModel();
var stateNode = document.getElementById("state");
var view = new ProcessorView(stateNode, model);
var program = document.getElementById("programInput");
var process = document.getElementById("processBtn");
var next = document.getElementById("nextBtn");
var controller = new ProcessorController(model, program, process, next);
