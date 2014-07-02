(function(daylight) {
	var template = daylight.template;
	var dEval = window.eval;
	var compile = {};
	compile.notEndTag = ["var", "set", "include"];
	compile.tag = function(text) {
		var copy = text =  text.replace(/(<(\/|.)?(var|foreach|block|if|elseif|else|for|set|include|template)(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>)/g, "$1 ");
		var tagReg = /(<(\/|.)?(var|foreach|block|for|if|elseif|else|set|include|template)((?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*)>)((.|\n|\r)[^\<]*)/g;
		var attributeReg = /([^\s=]+)\s*=\s*(\"([^\"]*?)\"|\'([^\']*?)\')/g;
		var notEndTag = this.notEndTag;
		var grade = 0;
		var variable = {};
		var depth = 0;
		var result2, result;
		while(result = tagReg.exec(copy)) {
			var sNode = result[1];
			var sEnd = result[2] || "";
			var nodeName = result[3];
			var sAttributes = result[4];
			var sText = result[5];
			var aAttributes = {};
			while(result2 = attributeReg.exec(sAttributes)) {
				//console.log(result2);
				aAttributes[result2[1]] = result2[3];
			}
	
				
			aAttributes["template-data-text"] = sText.replace(" ", ""); 

			if(sEnd === "/" ) {
				if(notEndTag.indexOf(nodeName) != -1)
					text = text.replace(sNode +" ", "");
				else
					text = text.replace(sNode +" ", "{/" + nodeName+"}");
			} else {
				var sAttribute = "";
				var sNodeType = nodeName +"Block";
				if(this.tag.sets[sNodeType]) {
					sAttribute = " " + this.tag.sets[sNodeType](grade, variable, aAttributes);
				}
				if(notEndTag.indexOf(nodeName) != -1)
					text = text.replace(result[0], "{"+nodeName+sAttribute+"}");
				else
					text = text.replace(sNode +" ", "{"+nodeName+sAttribute+"}");
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
		var key = attributes["key"] || "_";
		return key + " to " + name + " in " + items;
	}
	
	tagsets.varBlock = function(grade, variable, attributes) {
		var name = attributes["name"] || attributes["template-data-text"];
		//name = compile.replaceVariableName(grade, variable, name);
		return  name;
	}
	tagsets.ifBlock = tagsets.elseifBlock = function(grade, variable, attributes) {
		var cond = attributes["cond"];
		//cond = compile.replaceVariableName(grade, variable, cond, true);
		return  cond;
	}
	tagsets.forBlock = function(grade, variable, attributes) {
		//for i=1 to 4 add 1
		var name = attributes["var"];
		var from = attributes["from"];
		var to = attributes["to"];
		var addition = attributes["add"] || attributes["addition"] || 1;
		return  name + " = " + from + " to " + to + " add " + addition;
	}
	tagsets.templateBlock = function(grade, variable, attributes) {
		//for i=1 to 4 add 1
		var name = attributes["name"];
		var args = attributes["args"];
		return name +" " + args;
	}
	tagsets.includeBlock = function(grade, variable, attributes) {
		//for i=1 to 4 add 1
		var name = attributes["name"];
		var args = attributes["args"];
		if(args)
			return name + " " + args;
		else
			return name;
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
			var braceReg = /({(\/|.)?(var|foreach|block|for|if|elseif|else|set|\=|include|template)\s?([\s\S]*?)\})/mg;
			
			code.push("(function(args) {");
			code.push("args = args || {};");
			code.push("with (args) {");
			code.push("var window = null;");
			code.push("var texts = [];");
			code.push("var text = \"\";");
			
			for(var i = 0; i < length; i += 2) {
				text = texts[i + 0].replace(/\"/g, "\\\"");
				if(text !== "")
					code.push("texts.push(\"" + text +"\");");
	
				if(!texts[i + 1])
					continue;
					
				texts[i + 1].replace(braceReg, function() {
					var result = arguments;	
					var sEnd;
					var func;
					
					sEnd = result[2];
					if(sEnd) {
						func = bracesets[result[3] + "BlockEnd"];
						if(func)
							func(code, result[4]);
						else
							code.push("}");
					} else {
						func = bracesets[result[3] + "Block"];
						if(func)
							func(code, result[4]);
					}
				});
			}
			code.push("return texts.join(\"\");");
			code.push("};");
			code.push("});");
			var codeText = code.join("\n");
			
			
			//console.log(codeText);
			return compile.ev(codeText);
			
			
		})(divisionText);
	
	};
	compile.ev = function(codeText) {
		try {
			return dEval(codeText).bind({});
		} catch(e) {
			console.error(codeText);
			throw e;
		}
	};
	var bracesets = compile.brace.sets = {};
	bracesets.foreachBlock = function(code, attr) {
		//{foreach key to item in items]
		var items = attr.split(/\s(to|in)\s/);
		var length = items.length;
		var _key = "", _item, _items;
		if(length === 3) { //not key
			_key = "";
			_item = items[0];
			_items = items[2];
		} else if(length === 5) {
			_key = ", " + items[0];
			_item = items[2];
			_items = items[4];
		} else {
			throw new Error("Syntax Error: foreach");
		}
		code.push("daylight.each(" + _items + ", function(" + _item + _key + ") {");
		//code.push("var " + items[0] + " = " + items[1] + "[key];");
	};
	bracesets.foreachBlockEnd = function(code, attr) {
		code.push("});");
	};
	bracesets.forBlock = function(code, attr) {
		//{for i = 1 to 4 add 1}
		
		var items = attr.split(/\s?(to|=|add)\s?/g);
		var length = items.length;
		if(length !== 7 && length !== 5)
			throw new Error("Syntax Error : for");
			
		var _var = items[0];
		var from = items[2] || 0;
		var to = items[4] || 0;
		var add = items[6] || 1;
		var t = "for(var " + _var + "=" + from + ";" + from + "<=" + to + "&&" + _var + "<=" + to +"||" + from + ">" + to + "&&" + _var + ">=" + to + ";" + _var + "+=" + add +") {"
		code.push(t);
	}
	bracesets.ifBlock = function(code, attr) {
		code.push("if(" +attr+ ") {");
	}
	bracesets.elseifBlock = function(code, attr) {
		code.push("} else if(" +attr+ ") {");
	}
	bracesets.elseBlock = function(code, attr) {
		code.push("} else {");
	}	
	bracesets.varBlock = function(code, attr) {
		code.push("texts.push(" + attr + ");");
	}
	bracesets.setBlock = function(code, attr) {
		code.push("var " + attr +";");
	}
	bracesets.varBlock = function(code, attr) {
		code.push("texts.push(" + attr +");");
	}
	bracesets["=Block"] = function(code, attr) {
		code.push("texts.push(" + attr +");");
	}
	bracesets.templateBlock = function(code, attr) {
		var prefixTemplate = "$T$E";
		//{template name arg1,arg2,arg3}
		var items = (/(\S+)\s?([\s\S]*)?/mg).exec(attr);
		
		var name = items[1];
		var args = items[2] || "";
		code.push("function " + prefixTemplate + name +"("+ args +") {");
		code.push("var texts = [];");
	}
	bracesets.templateBlockEnd = function(code) {
		code.push("return texts.join(\"\");");
		code.push("}");
	}
	bracesets.includeBlock = function(code, attr) {
		var items = (/(\S+)\s?([\s\S]*)?/mg).exec(attr);
		if(!items)
			throw new Error("Syntax Error : include Error not has name");//문법 고치기
		
		var name = items[1];
		var args = items[2] || "";
		var prefixTemplate = "$T$E";
		code.push("if(typeof " + prefixTemplate + name + " === \"function\") {")
		code.push("texts.push(" + prefixTemplate + name+"(" + args + "));");
		code.push("}");
	}
	bracesets.includeBlockEnd = function(code, attr) {
	}
	daylight.templateEngine = function(info, txt) {
		if(arguments.length === 1) {
			txt = info;
			info = {};
		}
		if(!txt)
			return;
		var xml;
		if(daylight.isDaylight(txt)) {
			xml = txt.html();
		} else if(daylight.isElement(txt)) {
			xml = txt.innerHTML;
		} else {
			xml = txt;
		}
		
		info = info || {};
	
		var variable = {};
		variable.info = info;
		//xml = template.global(info, xml);
		xml = compile.tag(xml);
		var func = compile.brace(xml);
		var type = daylight.type(info);
		xml = "";
		if(type === "array") {
			var length = info.length;
			for(var i = 0; i < length; ++i) {
				xml += func(info[i]);
			}
		} else {
			xml = func(info);
		}
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
		this._html = html;
	}
	daylight.$TemplateEngine.prototype.compileTag = function() {
		this.html = compile.tag(this.html);
	}
	daylight.$TemplateEngine.prototype.compile = function() {
		this.func = compile.brace(this.html);
	}
	daylight.$TemplateEngine.prototype.process = function(info) {
		if(!this.func)
			this.compile();
		
		var result = "";
		try {
			result = this.func(info);
		} catch(e) {
			//console.log(this.html);
			throw e;
		}
		
		return result;
	};
	
	
	daylight.fn.extend({
		templateEngine: function(info, html) {
			this.html(daylight.templateEngine(info, html));
			return this;
		},
		setTemplateEngine: function(_templateEngine) {
			this._templateEngine = _templateEngine;
			return this;
		},
		compile: function(html) {
			html = html || this.html();
			var _templateEngine = this._templateEngine;
			if(!_templateEngine) {
				_templateEngine = this._templateEngine = new daylight.$TemplateEngine(html);
				_templateEngine.compileTag();
				_tamplateEngine.compile();
			} else {
				if(_templateEngine._html !== html) {
					_templateEngine.html = _templateEngine._html = html;
					_templateEngine.compileTag();
					_tamplateEngine.compile();
				}
			}
			return this;
		},
		process: function(info, html) {

			var _templateEngine = this._templateEngine;
			if(!_templateEngine) {
				_templateEngine = this._templateEngine = new daylight.$TemplateEngine(this.html());
				_templateEngine.compileTag();
			}
			this.html(_templateEngine.process(info));
			
			return this;
		}
	});
	String.prototype.process = function(info) {
		if(!this.func)
			this.func = compile.brace(this);
			
		return this.func(info);
	}
})(daylight);

(function(daylight) {
})(daylight);