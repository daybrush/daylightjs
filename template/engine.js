(function(daylight) {
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
			return "variable[" + i + "]." + name;
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
	compile.tag = function(text) {
		var copy = text =  text.replace(/(<(\/|.)?(var|foreach|block|if|for|set)(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>)/g, "$1 ");
		var tagReg = /(<(\/|.)?(var|foreach|block|for|if|set)((?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*)>)((.|\n|\r)[^\<]*)/g;
		var attributeReg = /([^\s=]+)\s*=\s*[\'\"]([^<\'\"]*)[\'\"]/g;
		var grade = 0;
		var variable = {};
		var depth = 0;
		var result2, result;
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
					text = text.replace(sNode, "");
				else
					text = text.replace(sNode, "{/" + sName+"}");
			} else {
				var sAttribute = "";
				var sNodeType = sName +"Block";
				if(this.tag.sets[sNodeType]) {
					sAttribute = " " + this.tag.sets[sNodeType](grade, variable, aAttributes);
				}
				if(sName === "var" || sName === "set")
					text = text.replace(result[0], "{"+sName+sAttribute+"}");
				else
					text = text.replace(sNode, "{"+sName+sAttribute+"}");
			}
		}
		return text;
	}
	var tagsets = compile.tag.sets = {};
	tagsets.setBlock = function(grade, variable, attributes) {
		var value = attributes["value"] || attributes["template-data-text"];
		var name = attributes["name"];
		return name + "=" + value;
	}
	tagsets.foreachBlock = function(grade, variable, attributes) {
		var items =attributes["items"];// compile.replaceVariableName(grade, variable, );
		var name = attributes["var"];
		return name + " in " + items;
	}
	
	tagsets.varBlock = function(grade, variable, attributes) {
		var name = attributes["name"] || attributes["template-data-text"];
		//name = compile.replaceVariableName(grade, variable, name);
		return  name;
	}
	tagsets.ifBlock = function(grade, variable, attributes) {
		var cond = attributes["cond"];
		//cond = compile.replaceVariableName(grade, variable, cond, true);
		return  cond;
	}
	tagsets.forBlock = function(grade, variable, attributes) {
		//for i=1 to 4 add 1
		var name = attributes["var"];
		var from = attributes["from"];
		var to = attributes["to"];
		var addition = attributes["addiation"] || 1;
		return  name + " = " + from + " to " + to + " add " + addition;
	}
	compile.brace = function(text) {
		var token = "-%daylightT%-&@-";
		var splitter = /(\{[\s\S]*?\})/g;
			var copy = text;
		var grade = 0, nodeName;
		var replaceText = "";
		var grade = 0;
		var is_eval;
		var _grade;
		
		//console.log(text.replace(splitter, token+"$1"+token).split(token));
		var divisionText = text.replace(/\n/g, "\\n");
		divisionText = divisionText.replace(splitter, token+"$1"+token).split(token);
		var length = divisionText.length;
		
		
		return (function(texts) {
			//console.log(texts);
			var code = [];
			var length = texts.length;
			var result;
	
	
			var text;
			var vars = {};
			var braceReg = /({(\/|.)?(var|foreach|block|for|if|set|\=|include|template)\s?([\s\S]*?)\})/mg;
			
			code.push("(function(args) {");
			code.push("args = args || {};");
			code.push("with (args) {");
			code.push("var text = \"\";");
			for(var i = 0; i < length; i += 2) {
				text = texts[i + 0].replace(/\"/g, "\\\"");
				code.push("text = text + \"" + text +"\";");
	
				if(!texts[i + 1])
					continue;
					
				texts[i + 1].replace(braceReg, function() {
					var result = arguments;	
					var sEnd;
					var func;
					
					sEnd = result[2];
					if(sEnd) {
						code.push("}");
					} else {
						func = bracesets[result[3] + "Block"];
						if(func)
							func(code, result[4]);
					}
				});
			}
			code.push("return text;");
			code.push("}");
			code.push("});");
			var codeText = code.join("\n");
			
			return compile.ev(codeText);
			
			
		})(divisionText);
	
	};
	
	var bracesets = daylight.template.compile.brace.sets = {};
	bracesets.foreachBlock = function(code, attr) {
		var items = attr.split(" in ");
		code.push("for(var key in " + items[1] +") {");
		code.push("var " + items[0] + " = " + items[1] + "[key];");
	};
	bracesets.forBlock = function(code, attr) {
		//{for i = 1 to 4 add 1}
		
		var items = attr.split(/\s?(to|=|add)\s?/g);
		if(items.length !== 7)
			throw new Error("Syntax Error : for");
			
		var _var = items[0];
		var from = items[2];
		var to = items[4];
		var add = items[6];
		code.push("for(var " + _var + "=" + from + ";" + from + "<" + to + "&&" + _var + "<=" + to +"||" + from + ">=" + to + "&&" + _var + ">=" + to + ";" + _var + "+=" + add +") {");
	}
	bracesets.ifBlock = function(code, attr) {
		code.push("if(" +attr+ ") {");
	}
	bracesets.varBlock = function(code, attr) {
		code.push("text = text + " + attr);
	}
	bracesets.setBlock = function(code, attr) {
		code.push("var " + attr +";");
	}
	bracesets.varBlock = function(code, attr) {
		code.push("text = text + " + attr +";");
	}
	bracesets["=Block"] = function(code, attr) {
		code.push("text = text + " + attr +";");
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
		var func = daylight.template.compile.brace(xml);
		xml = func(info);
		return xml;
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
	};
	daylight.$TemplateEngine = function TemplateEngine(html) {
		this.html = html;
	}
	daylight.$TemplateEngine.prototype.compileTag = function(info) {
		this.html = daylight.template.compile.tag(this.html);
	}
	daylight.$TemplateEngine.prototype.compile = function() {
		this.func = daylight.template.compile.brace(this.html);
	}
	daylight.$TemplateEngine.prototype.process = function(info) {
		if(!this.func)
			this.compile();
			
		return this.func(info);
	};
	
	
	daylight.fn.extend({
		templateEngine: function(info, html) {
			this.html(daylight.templateEngine(info, html));
			return this;
		}
	});

})(daylight);

(function(daylight) {
	var dEval = window.eval;
	daylight.template.compile.ev = function(codeText) {
		return dEval(codeText).bind({});
	};
})(daylight);