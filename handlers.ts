class ResetHandler extends HandlerBase {
	header = 0b0001;
	name = "RST";
	shortArgs = 1;
	description = "r[x] = 0";

	exec(cmd : Command, model : ProcessorModel) {
		let idx = model.getCommonRegIdx(cmd.args[0]);
		model.setRegister(idx, BitSet.empty(ProcessorModel.regSize));
	}
}

class IncHandler extends HandlerBase {
	header = 0b0010;
	name = "INC";
	shortArgs = 1;
	description = "r[x]++";

	exec(cmd : Command, model : ProcessorModel) {
		let index = model.getCommonRegIdx(cmd.args[0]);
		let val = model.registers[index];
		let newVal = val.setValue(val.toNum() + 1);
		model.setRegister(index, newVal);
	}
}

class MoveHandler extends MoveHandlerBase {
	header = 0b0011;
	name = "MOV";
	shortArgs = 2;
	description = "r[y] = r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		let fromIdx = model.getCommonRegIdx(cmd.args[0]);
		let toIdx = model.getCommonRegIdx(cmd.args[1]); 
		this.commonMove(model, fromIdx, toIdx);
	}
}

class ResetAccHandler extends HandlerBase {
	header = 0b0100;
	name = "RSTA";
	description = "r[0] = 0";

	exec(cmd : Command, model : ProcessorModel) {
		model.setRegister(HandlerBase.accRegIdx, BitSet.empty(ProcessorModel.regSize));
	}
}

class IncAccHandler extends HandlerBase {
	header = 0b0101;
	name = "INCA";
	description = "r[0]++";

	exec(cmd : Command, model : ProcessorModel) {
		let idx = HandlerBase.accRegIdx;
		let val = model.registers[idx];
		let newVal = val.setValue(val.toNum() + 1);
		model.setRegister(idx, newVal);
	}
}

class MoveAccHandler extends MoveHandlerBase {
	header = 0b0110;
	name = "MOVA";
	shortArgs = 1;
	description = "r[0] = r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		let fromIdx = model.getCommonRegIdx(cmd.args[0]);
		this.commonMove(model, fromIdx, HandlerBase.accRegIdx);
	}
}

class JumpHandler extends HandlerBase {
	header = 0b0111;
	name = "JMP";
	wideArgs = 1;
	description = "go to x";

	exec(cmd : Command, model : ProcessorModel) {
		model.setCounter(cmd.args[0]);
	}
}

class JumpZeroHandler extends HandlerBase {
	header = 0b1000;
	name = "JMZ";
	shortArgs = 1;
	wideArgs = 1;
	description = "go to y if r[x] == 0";

	exec(cmd : Command, model : ProcessorModel) {
		let idx = model.getCommonRegIdx(cmd.args[0]);
		let condition = model.registers[idx].toNum() == 0;
		if (condition) {
			model.setCounter(cmd.args[1]);
		}
	}
}

class JumpEqualHandler extends HandlerBase {
	header = 0b1001;
	name = "JME";
	shortArgs = 2;
	wideArgs = 1;
	description = "go to z if r[x] == r[y]";

	exec(cmd : Command, model : ProcessorModel) {
		let leftIdx = model.getCommonRegIdx(cmd.args[0]);
		let rightIdx = model.getCommonRegIdx(cmd.args[0]);
		let registers = model.registers;
		let condition = registers[leftIdx] == registers[rightIdx];
		if (condition) {
			model.setCounter(cmd.args[0]);
		}
	}
}

class LoadHandler extends HandlerBase {
	header = 0b1010;
	name = "LD";
	shortArgs = 1;
	wideArgs = 1;
	description = "load mem from y to r[x]";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = cmd.args[1];
		let len = ProcessorModel.regSize;
		let result = model.getMemory(addr, len);
		let regIdx = model.getCommonRegIdx(cmd.args[0]);
		model.setRegister(regIdx, result);
	}
}

class SaveHandler extends HandlerBase {
	header = 0b1011;
	name = "SV";
	shortArgs = 1;
	wideArgs = 1;
	description = "save r[x] to mem at y";

	exec(cmd : Command, model : ProcessorModel) {
		let addr = cmd.args[1];
		let regIdx = model.getCommonRegIdx(cmd.args[0]);
		let content = model.registers[regIdx];
		model.setMemory(addr, content);
	}
}