class ResetHandler extends HandlerBase {
	header = 0b00001;
	name = "RST";
	shortArgs = 1;
	description = "r[x] = 0";

	exec(cmd : Command, model : ProcessorModel) {
		model.setCommonRegister(cmd.args[0], BitSet.empty(Setup.regSize));
	}
}

class IncHandler extends HandlerBase {
	header = 0b00010;
	name = "INC";
	shortArgs = 1;
	description = "r[x]++";

	exec(cmd : Command, model : ProcessorModel) {
		let val = model.getCommonRegister(cmd.args[0]);
		let newVal = val.setValue(val.toNum() + 1);
		model.setCommonRegister(cmd.args[0], newVal);
	}
}

class MoveHandler extends HandlerBase {
	header = 0b00011;
	name = "MOV";
	shortArgs = 2;
	description = "r[y] = r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		let value = model.getCommonRegister(cmd.args[0]);
		model.setCommonRegister(cmd.args[1], value);
	}
}

class ResetAccHandler extends HandlerBase {
	header = 0b00100;
	name = "RSTA";
	description = "a = 0";

	exec(cmd : Command, model : ProcessorModel) {
		model.setAccumRegister(BitSet.empty(Setup.regSize));
	}
}

class IncAccHandler extends HandlerBase {
	header = 0b00101;
	name = "INCA";
	description = "a++";

	exec(cmd : Command, model : ProcessorModel) {
		let val = model.getAccumRegister();
		let newVal = val.setValue(val.toNum() + 1);
		model.setAccumRegister(newVal);
	}
}

class MoveAccHandler extends HandlerBase {
	header = 0b00110;
	name = "MOVA";
	shortArgs = 1;
	description = "a = r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		let value = model.getCommonRegister(cmd.args[0]);
		model.setAccumRegister(value);
	}
}

class JumpHandler extends HandlerBase {
	header = 0b00111;
	name = "JMP";
	wideArgs = 1;
	description = "go to x";

	exec(cmd : Command, model : ProcessorModel) {
		model.setCounter(cmd.args[0]);
	}
}

class JumpZeroHandler extends HandlerBase {
	header = 0b01000;
	name = "JMZ";
	shortArgs = 1;
	wideArgs = 1;
	description = "go to y if r[x] == 0";

	exec(cmd : Command, model : ProcessorModel) {
		let condition = model.getCommonRegister(cmd.args[0]).toNum() == 0;
		if (condition) {
			model.setCounter(cmd.args[1]);
		}
	}
}

class JumpEqualHandler extends HandlerBase {
	header = 0b01001;
	name = "JME";
	shortArgs = 2;
	wideArgs = 1;
	description = "go to z if r[x] == r[y]";

	exec(cmd : Command, model : ProcessorModel) {
		let condition = 
			model.getCommonRegister(cmd.args[0]).toNum() == model.getCommonRegister(cmd.args[1]).toNum();
		if (condition) {
			model.setCounter(cmd.args[2]);
		}
	}
}

class LoadHandler extends HandlerBase {
	header = 0b01010;
	name = "LD";
	shortArgs = 1;
	wideArgs = 1;
	description = "load mem from y to r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = cmd.args[1];
		let len = Setup.regSize;
		let result = model.getMemory(addr, len);
		model.setCommonRegister(cmd.args[0], result);
	}
}

class SaveHandler extends HandlerBase {
	header = 0b01011;
	name = "SV";
	shortArgs = 1;
	wideArgs = 1;
	description = "save r[x] to mem at y";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = cmd.args[1];
		let content = model.getCommonRegister(cmd.args[0]);
		model.setMemory(addr, content);
	}
}

class LoadByRegHandler extends HandlerBase {
	header = 0b01100;
	name = "LDR";
	shortArgs = 2;
	description = "load mem from r[x] to r[y]";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = cmd.args[1];
		let len = Setup.regSize;
		let result = model.getMemory(addr, len);
		model.setCommonRegister(cmd.args[0], result);
	}
}

class SaveByRegHandler extends HandlerBase {
	header = 0b01101;
	name = "SVR";
	shortArgs = 2;
	description = "save r[x] to mem at r[y]";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = model.getCommonRegister(cmd.args[1]);
		let content = model.getCommonRegister(cmd.args[0]);
		model.setMemory(addr, content);
	}
}

class AddHandler extends HandlerBase {
	header = 0b01111;
	name = "ADD";
	shortArgs = 2;
	description = "add r[x] to r[y]";

	exec(cmd : Command, model : ProcessorModel) {
		let sendValue = model.getCommonRegister(cmd.args[0]);
		let recValue = model.getCommonRegister(cmd.args[1]);
		let newVal = BitSet.fromNum(sendValue.toNum() + recValue.toNum(), Setup.regSize);
		model.setCommonRegister(cmd.args[1], newVal);
	}
}

class PutHandler extends HandlerBase {
	header = 0b01111;
	name = "PUT";
	shortArgs = 1;
	wideArgs = 1;
	description = "put y to r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		model.setCommonRegister(cmd.args[0], cmd.args[1]);
	}
}

class AddAccHandler extends HandlerBase {
	header = 0b10000;
	name = "ADDA";
	shortArgs = 1;
	description = "add r[x] to a";

	exec(cmd : Command, model : ProcessorModel) {
		let newVal = BitSet.fromNum(
			model.getAccumRegister().toNum() + 
			model.getCommonRegister(cmd.args[0]).toNum(),
			Setup.regSize);
		model.setAccumRegister(newVal);
	}
}

class AccMoveHandler extends HandlerBase {
	header = 0b10001;
	name = "AMOV";
	shortArgs = 1;
	description = "r[x] = a";

	exec(cmd : Command, model : ProcessorModel) {
		let value = model.getAccumRegister();
		model.setCommonRegister(cmd.args[0], value);
	}
}

class LoadByAccRegHandler extends HandlerBase {
	header = 0b10010;
	name = "LDRA";
	shortArgs = 1;
	description = "load mem from a to r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = model.getAccumRegister();
		let len = Setup.regSize;
		let result = model.getMemory(addr, len);
		model.setCommonRegister(cmd.args[0], result);
	}
}

class SaveByAccRegHandler extends HandlerBase {
	header = 0b10011;
	name = "SVRA";
	shortArgs = 1;
	description = "save r[x] to mem at a";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = model.getAccumRegister();
		let content = model.getCommonRegister(cmd.args[0]);
		model.setMemory(addr, content);
	}
}