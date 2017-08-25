var model = new ProcessorModel();

var stateNode = document.getElementById("state");
var view = new ProcessorView(stateNode, model);

var program = <HTMLInputElement>document.getElementById("programInput");
var process = <HTMLButtonElement>document.getElementById("processBtn");
var next = <HTMLButtonElement>document.getElementById("nextBtn");
var controller = new ProcessorController(model, program, process, next);