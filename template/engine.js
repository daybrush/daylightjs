//@{XMLParser.js}

var template = daylight.template;

var compile = template.compile = {};
template.defineVariable = function(grade, variable, name, value) {
	variable[grade] = variable[grade] || {};
	variable[grade][name] = value;
}
compile.getFullVariableName = function(grade, variable, name, is_eval) {
	var length = grade;
	for(var i = grade; i >= 0; i--) {
		if(!variable.hasOwnProperty(i))
			continue;
		
		if(!variable[i])
			continue;
		
		if(!variable[i].hasOwnProperty(name))
			continue;
			
		if(is_eval)
			return "variable[" + i + "]." + name;
		return "variable." + i + "." + name;
	}
	
	return "variable.info." + name;
}
compile.replaceVariableName = function(grade, variable, text, is_eval) {
	if(!text)
		return "";
	
	var imVariables = text.match( /\@([A-Za-z0-9_]+)/gi) || [];//즉시 실행 변수
	var length = imVariables.length;
	var _variable, name, value, scopeLength, j;
	for(var i = 0; i < length; ++i) {
		_variable = imVariables[i].replace("@", "");
		_variable = this.getFullVariableName(grade, variable, _variable);
		text = text.replaceAll(imVariables[i], "@(" + _variable + ")");
	}
	
	var runVariables = text.match( /\$([A-Za-z0-9_]+)/gi) || [];//즉시 실행 변수
	length = runVariables.length;
	var _variable, name, value, scopeLength, j;
	for(var i = 0; i < length; ++i) {
		_variable = runVariables[i].replace("$", "");
		_variable = this.getFullVariableName(grade, variable, _variable, is_eval);
		text = text.replaceAll(runVariables[i],  (is_eval ? "" : "$") + _variable);
	}
	return text;
}
compile.sets = {};
compile.sets.setBlock = function(grade, variable, attributes) {
	var value = attributes["value"] || attributes["template-data-text"];
	var name = attributes["name"];
	value = compile.replaceVariableName(grade, variable, value, true);
	template.defineVariable(grade, variable, name, value);
	return name + "=" + value;
}
compile.sets.foreachBlock = function(grade, variable, attributes) {
	var items = compile.replaceVariableName(grade, variable, attributes["items"]);
	var name = attributes["var"];
	template.defineVariable(grade, variable, "key", "@key");
	template.defineVariable(grade, variable, name, "$items[@key]");
	return name + " in " + items;
}

compile.sets.varBlock = function(grade, variable, attributes) {
	var name = attributes["name"] || attributes["template-data-text"];
	name = compile.replaceVariableName(grade, variable, name);
	return  name;
}
compile.sets.ifBlock = function(grade, variable, attributes) {
	var cond = attributes["cond"];
	cond = compile.replaceVariableName(grade, variable, cond, true);
	return  cond;
}
compile.sets.forBlock = function(grade, variable, attributes) {
	var from = attributes["from"];
	var to = attributes["to"];

	var addition = attributes["addiation"] || 1;
	template.defineVariable(grade, variable, "index", "@index");
	return  from + " to " + to + " add " + addition;
}
daylight.template.compile.brace = function(variable, text) {
	var tagReg = /({(\/)?(var|foreach|block|for|if|set|\=)([0-9]*)?\s?([\s\S]*?)\})/mg;
	var copy = text;
	var grade = 0, nodeName;
	var replaceText = "";
	var grade = 0;
	var is_eval;
	var _grade;
	while(result = tagReg.exec(copy)) {
		var nodeName = result[3];
		var num = result[4];
		var sEnd = result[2] || "";
		is_eval = nodeName === "if" || nodeName === "set";
		var attr = result[5] || "";
		var is_compiled = typeof num !== "undefined";
		if(!is_compiled)
			attr = compile.replaceVariableName(grade, variable, attr, is_eval);
			
		if(nodeName === "=") {
			//console.log(nodeName);
			//attr = " " + attr;
		}
		grade = is_compiled ? parseInt(num) : grade;
		
		if(nodeName !== "var" && nodeName !== "set" && nodeName !== "=") {
			grade += sEnd === "/" ? -1 : 1;				
		}
		
		if(!is_compiled) {
			if(nodeName === "var" || nodeName === "set" || nodeName === "=") {
				_grade = grade;
			} else {
				_grade = (sEnd === "/" ? grade + 1 : grade);
			}
			if( nodeName === "=")
				text = text.replace(result[0], "{var" + _grade + " " + attr +"}{/var" + _grade + "}");
			else
				text = text.replace(result[0], "{" + sEnd + nodeName + _grade + (sEnd ? "" : " ") + attr +"}");
			//console.log("change", result[0], "to", "{" + sEnd + nodeName + grade + attr +"}");
		}
	
	}
	return text;
}
daylight.template.compile.tag = function(text) {
	var copy = text =  text.replace(/(<(\/|.)?(var|foreach|block|if|for|set)(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>)/g, "$1 ");
	var tagReg = /(<(\/|.)?(var|foreach|block|for|if|set)((?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*)>)((.|\n|\r)[^\<]*)/g;
	var attributeReg = /([^\s=]+)\s*=\s*[\'\"]([^<\'\"]*)[\'\"]/g;
	var grade = 0;
	var variable = {};
	var depth = 0;
	while(result = tagReg.exec(copy)) {
		var sNode = result[1];
		var sEnd = result[2] || "";
		var sName = result[3];
		var sAttributes = result[4];
		var sText = result[5];
		var aAttributes = {};
		while(result2 = attributeReg.exec(sAttributes)) {
			aAttributes[result2[1]] = result2[2];
		}

		if(sName !== "var" && sName !== "set") {
			grade += sEnd === "/" ? -1 : 1;
			
			//if(sEnd === "/")
				//variable[grade + 1] = {};
				
		}
			
		aAttributes["template-data-text"] = sText.replace(" ", ""); 
		if(grade > depth)
			depth = grade;
		
		if(sEnd === "/" ) {
			if(sName === "var" || sName === "set")
				text = text.replace(sNode, "{/" + sName+(grade)+"}");
			else
				text = text.replace(sNode, "{/" + sName+(grade+1)+"}");
		} else {
			var sAttribute = "";
			var sNodeType = sName +"Block";
			if(compile.sets[sNodeType]) {
				sAttribute = " " + compile.sets[sNodeType](grade, variable, aAttributes);
			}
			if(sName === "var" || sName === "set")
				text = text.replace(result[0], "{"+sName+grade+sAttribute+"}");
			else
				text = text.replace(sNode, "{"+sName+grade+sAttribute+"}");
		}
	}
	
	text = this.brace(variable, text);
	return text;
}
var link = daylight.template.link = function(info, text) {
	var copy = text;// =  text.replace(/({(\/|.)?(var|foreach|block|if|for|set)([0-9]+)(?:"[^"]*"['"]*|'[^']*'['"]*|[^'"}])*})/g, "$1 ");
	var variable = {info:info};
	return this.link.analyze(variable, text);
}
link.defineVariable = function(grade, variable, name, value, contents) {
	variable[grade] = variable[grade] || {};
	variable[grade][name] = value;

	if(typeof contents === "undefined")
		return;
		
	contents = contents.replaceAll("@(variable." + grade +"." + name +")", value);
	return contents;
}
template.scope = function(value, scopes, j) {
	j = j || 0;
	try {
		var scopeLength = scopes.length;
		for(; j < scopeLength; ++j) {
			value = value[scopes[j]];
		}
	} catch(e) {
		console.error(scopes, j);
		throw new Error("No Scope");
	}
	return value;
}

link.getImVariable = function(variable, text) {
	var copy = text;
	var reg =  /\@\(([A-Za-z0-9\.]*)\)/gi;
	var _variable, _variables;
	while(_variables = reg.exec(copy)) {
		_variable = _variables[1];
		_variable = link.getVariable (variable, "$" + _variable);
		text = text.replaceAll(_variables[0], _variable);
	}
	return text;
}
link.getVariable = function(variable, text) {

	var _variables = text.match( /\$([A-Za-z0-9\.]*)/gi) || [];
	var _variable, lengh = _variables.length;
	for(var i = 0; i < lengh; ++i) {
		_variable = _variables[i].replace("$","");//.replace(")");
		_variable = _variable.split(".");
		_variable = template.scope(variable[_variable[1]], _variable, 2);
		return _variable;
	}
	
	return text;
}
link.getTotalVariable = function(variable, text) {
	var v = this.getImVariable(variable, text);
	return link.getVariable(variable, v);
}
link.sets = {
	foreachBlock: function(grade, variable, attr, contents) {
		var item = attr.split(" in ");
		var _var = item[0];
		var _items = link.getVariable(variable, item[1]);
		variable[grade] = {};

		var _item;
		
		text = "";


		for(var i in _items) {
			var copyContents = contents;
			_item = _items[i];
			copyContents = link.defineVariable(grade, variable, "key", i, copyContents);
			copyContents = link.defineVariable(grade, variable, _var, _items[i], copyContents);
			
			text += link.analyze(variable, copyContents);
		}
		
		return text;

	},
	varBlock : function(grade, variable, attr, contents) {
		var value = link.getImVariable(variable, attr);
		value = link.getVariable(variable, value);
		return value;
	},
	setBlock: function(grade, variable, attr) {
		var item = attr.split("=");
		var name = item[0];
		var value = link.getImVariable(variable, item[1]);
		try {
			value = eval(value);
		} catch(e) {
			//console.error()
			throw new Error("Syntax Error : " + item[1]);
		}
		link.defineVariable(grade, variable, name, value);
		return "";
	},
	ifBlock: function(grade, variable, attr, contents) {
		var cond = link.getImVariable(variable, attr);
		try {
			var is_result = !!eval(cond);
			if(is_result) {
				return link.analyze(variable, contents);
			}
			
		} catch(e) {
			throw new Error("Synstax Error : " + attr + "    " + cond);
		}
		return "";
	},
	forBlock: function(grade, variable, attr, contents) {
		var item = attr.split(" to ");
		var from = parseFloat(link.getTotalVariable(variable, item[0]));
		
		var item2 = item[1].split(" add ");
		var to = parseFloat(link.getTotalVariable(variable, item2[0]));
		var addition = item2[1]? parseFloat(link.getTotalVariable(variable, item2[1])): from > to ? -1 : 1;

		variable[grade] = {};

		var _item;
		
		var text = "";
		for(var i = from; from < to && i <= to || from >= to && i >= to; i += addition) {
			var copyContents = contents;
			copyContents = link.defineVariable(grade, variable, "index", i, copyContents);
			text += link.analyze(variable, copyContents);
		}
		
		return text;
	}
};
link.braceReg = /({((var|foreach|block|for|if|set)([0-9]+))\s*((?:"[^"]*"['"]*|'[^']*'['"]*|[^'"}])*)})([\s\S]*?)\{\/\2\}/g;
link.analyze = function(variable, text) {

	var copy = text;
	var tagReg = link.braceReg;
	var result2, fun, resultText;
	while(result = tagReg.exec(copy)) {
		var outer = result[0];
		var nodeName = result[3];
		var _grade = result[4];
		var attributes = result[5];
		var contents = result[6];
		func = this.sets[nodeName + "Block"];

		resultText = "";
		if(func)
			resultText = func(_grade, variable, attributes, contents);
		text = text.replace(outer, resultText);
	}
	
	return text;
}
template.global = function(info, text) {
	var variables = text.match( /\{=([A-Za-z_\.]*)\}/gi) || [];
	//console.log(variables);
	var length = variables.length;
	var _variable, value, scopeLength, j;
	for(var i = 0; i < length; ++i) {
		_variable = variables[i].replace("{=", "").replace("}", "");
		_variable = _variable.split(".");
		value = info[_variable[0]];
		value = template.scope(value, _variable, 1);
		text = text.replace(variables[i], value);
	}
	
	return text;
}
daylight.templateEngine = function(info, txt) {
	if(arguments.length === 1) {
		txt = info;
		info = {};
	}
	if(!txt)
		return;
	var xml;
	if(typeof txt === "object") {
		xml = txt.innerHTML;
	} else {
		xml = txt;
	}

	info = info || {};
	window.xmlxml = xml;

	
	var variable = {};
	variable.info = info;
	//xml = template.global(info, xml);
	xml = daylight.template.compile.tag(xml);
	xml = daylight.template.link(info, xml);

	
	return xml;
}

prototype.templateEngine = function(info, html) {
	this.html(daylight.templateEngine(info, html));
	return this;
}
daylight.template.loadURL = function(url, callback) {
	function _response(text) {
		var template = new daylight.$TemplateEngine(text);
		callback(template);
	}
	daylight.ajax(url).done(function(txt, req) {	
		_response(req.responseText);
	}).fail(function(req) {
		if(!req.responseText)
			return;
		
		_response(req.responseText);
	});
}
daylight.$TemplateEngine = function TemplateEngine(html) {
	this.html = html;
}
daylight.$TemplateEngine.prototype.compileTag = function(info) {
	this.html = daylight.template.compile.tag(this.html);
}
daylight.$TemplateEngine.prototype.compileBrace = function(info) {
	this.html = daylight.template.compile.brace(this.html);
}
daylight.$TemplateEngine.prototype.global = function(info) {
	return  daylight.template.global(info, this.html);
}
daylight.$TemplateEngine.prototype.process = function(info) {
	var html = this.global(info);
	return daylight.template.link(info, html);
}




