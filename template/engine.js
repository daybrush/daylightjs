//@{XMLParser.js}

var template = daylight.template;
var _tab = function(grade) {
	return daylight.repeat("   ", grade);
}
template._outerHTML = function(xml) {
	return daylight.parseXMLtoHTML(xml.cloneNode(true)).outerHTML;
}
template._innerHTML = function(xml, xs) {
	xs = xs || new XMLSerializer();
	var childNodes = xml.childNodes;
	var length = childNodes.length;
	var html = "";
	for(var i = 0; i < length; ++i) {
		html += xs.serializeToString(childNodes[i]);
	}
	return html;

};
template._replace = function(xml, element) {
	xml.parentNode.insertBefore(element, xml);
	xml.parentNode.removeChild(xml);
};
template._before = function(dom, html) {
	//dom.insertAdjacentHTML
};
template._remove = function(xml) {
	xml.parentNode.removeChild(xml);
};
template.replaceVariableName = function(grade, variable, text) {
	var variables = text.match( /\@([A-Za-z\.]*)/gi) || [];
	
	//console.log(variables);
	var length = variables.length;
	var _variable, value, scopeLength, j;
	for(var i = 0; i < length; ++i) {
		_variable = variables[i].replace("@", "");
		_variable = _variable.split(".");
		value = this.getVariableName(grade, variable, _variable[0]);
		
		
		scopeLength = _variable.length;
		for(j = 1; j < scopeLength; ++j) {
			value = value + "." + _variable[j];
		}
		text = text.replace(variables[i], value);
	}
	
	return text;
}
template.replaceVariable = function(grade, variable, text) {
	var variables = text.match( /\@([A-Za-z_\.]*)/gi) || [];
	//var variables = text.match( /\{(.+?)\}/gi) || [];
	var length = variables.length;
	var _variable, value, scopeLength, j;
	for(var i = 0; i < length; ++i) {
		_variable = variables[i].replace("@", "");//.replace("}", "");
		_variable = _variable.split(".");
		value = this.variable(grade, variable, _variable[0]);
		
		value = this.scope(value, _variable, 1);
		text = text.replace(variables[i], value);
	}
	
	return text;
}
template.evalBlock = function(grade, variable, text) {
//text = this.replaceVariableName(grade, variable, text);
	var blocks = text.match( /\{(.+?)\}/gi) || [];
	var length = blocks.length;
	//var 
	var block;
	try {
		for(var i = 0; i < length; ++i) {
			block = blocks[i];
			block = this.replaceVariable(grade, variable, block);
			block = block.replace("{", "").replace("}", "");
			block = eval(block);
			text = text.replace(blocks[i], block);
		}
	} catch(e) {
		throw new Error("Parsing Error : " + block);
	}
	return text;
}
template.getVariableName = function(grade, variable, name) {
	var length = grade;
	for(var i = grade; i >= 0; i--) {
		if(!variable.hasOwnProperty(i))
			continue;
		
		if(!variable[i])
			continue;
		
		if(!variable[i].hasOwnProperty(name))
			continue;
			
		
		return "variable[" + i + "]." + name;
	}
	
	return "variable.info." + name;
}
template.scope = function(value, scopes, j) {
	j = j || 0;
	try {
		var scopeLength = scopes.length;
		for(; j < scopeLength; ++j) {
			value = value[scopes[j]];
		}
	} catch(e) {
		throw new Error("No Scope");
	}
	return value;
}
template.variable = function(grade, variable, name) {
	var length = grade;
	var name = name.split(".");
	for(var i = grade; i >= 0; i--) {
		if(!variable.hasOwnProperty(i))
			continue;
		
		if(!variable[i])
			continue;
		
		if(!variable[i].hasOwnProperty(name[0]))
			continue;
			
		
		return this.scope(variable[i], name);
	}
	
	return this.scope(variable.info, name);
}
template.condition = function(grade, variable, cond) {
	cond = this.replaceVariableName(grade, variable, cond);
	try {
		
			var v = !!eval(cond);
		//console.debug("condition", cond, v);
	}catch(e) {
		console.error("Parsing error condition :", cond)
	}
	return v;
}
template.ifblock = function(grade, variable, xml, nodeName) {
	if(nodeName === "elseif" || nodeName === "else") {
		var name = daylight(xml).prev().nodeName();
		if(name !== "if" && name !== "elseif") {
			throw new Error("Parsing Error: No If Block");
		}
	}
	
}
template.loop = function(grade, variable, xml, from, to, addition) {
	try {
		from = this.replaceVariableName(grade, variable, from);
		from = eval(from);
	} catch(e) {
		throw new Error("Parsing Error in loop from : " + from );
	}
	try {
		to = this.replaceVariableName(grade, variable, to);
		to = eval(to);
	} catch(e) {
		throw new Error("Parsing Error in loop to : " + to);
	}
	addition = parseFloat(addition) || 1;

	var cloneXML;
	var cloneHTML = "";
	for(var i = from;addition >= 0 && i <= to || addition < 0 && i >= to; i+= addition) {
		cloneXML = (xml.cloneNode(true));
		this.defineVariable(grade + 1, variable, "index", i);
		this.readChildren(grade, variable, cloneXML);
		cloneHTML += cloneXML.innerHTML;
	}
	xml.outerHTML = cloneHTML;
}
template.forBlock = function(grade, variable, xml) {
	
}
template.foreach = function(grade, variable, xml) {
	var items = xml.getAttribute("items");
	var name = xml.getAttribute("var");
	
	if(!items || !name) {
		var from = xml.getAttribute("from");
		var to = xml.getAttribute("to");
		var addition = xml.getAttribute("addition");
		if(from === null || to === null) {
			xml.parentNode.removeChild(xml);
			return;
		}
		template.loop(grade, variable, xml, from, to, addition);
		return;
	}
	items = this.replaceVariableName(grade, variable, items);
	try {
		items = eval(items);
	} catch(e) {
		//console.error(_tab(grade), "foreach", xml);
		throw new Error(grade + " Parsing Error in foreach: " + items);	
	}
	var type = daylight.type(items);
	
	var cloneXML;
	var cloneHTML = "";
	var originalXML = xml;
	if(xml.nodeName !== "FOREACH") {
		//originalXML = xml.cloneNode(true);
		xml.removeAttribute("items");
		xml.removeAttribute("var");
		xml.removeAttribute("foreach");
	}
	for(var key in items) {
		cloneXML = (xml.cloneNode(true));
		this.defineVariable(grade + 1, variable, name, items[key]);
		this.defineVariable(grade + 1, variable, "key", key);
		this.readChildren(grade, variable, cloneXML);
		cloneHTML += cloneXML.innerHTML;
	}

	if(xml.nodeName !== "FOREACH")
		xml.innerHTML = cloneHTML;
	else
		xml.outerHTML = cloneHTML;
	
}
template.defineVariable = function(grade, variable, name, value) {
	variable[grade] = variable[grade] || {};
	variable[grade][name] = value;
	
	
	//console.debug(_tab(grade), "defineVariable",grade, name, variable[grade][name]);
}
daylight.template.setVariable = function(grade, variable, xml) {
	
	var name = xml.getAttribute("name");
	if(name === null || name === "")
		return;
	
	var value = xml.innerText || xml.getAttribute("value") || "";
	value = this.evalBlock(grade, variable, value);
	
	var objText = xml.getAttribute("in");
	if(objText) {
		var obj = this.variable(grade, variable, objText);
		value = this.replaceVariable(grade, variable, value);
		if(obj)
			this.defineVariable(grade, variable, name, obj[value]);		
	} else {
		this.defineVariable(grade, variable, name, value);
	}

	this._remove(xml);
}
daylight.template.getVariable = function(grade, variable, dom) {
	var name = dom.innerText || dom.getAttribute("name");
	if(name === null || name === "") {
		dom.outerHTML = "";
		return;
	}
	var value = "";
	var objText = dom.getAttribute("in");
	
	name = this.replaceVariable(grade, variable, name);
	if(objText) {
		var obj = this.variable(grade, variable, objText);
		if(obj)
			value = obj[name];
	} else {
		value = template.variable(grade, variable, name);
	}
	dom.outerHTML = value;

}
daylight.template.func = {
	addClass: function( c1, c2) {
		var length = arguments.length;
		
		for(var i = 0; i < length; ++i) {
			this.className += " " + arguments[i];
		}
	},
	attr: function(name, value) {
		this.setAttribute(name, value);
	},
	css: function() {
		var length = arguments.length;
		var cssText = this.style.cssText;
		var name, value;
		for(i = 0; i < length; i += 2) {
			name = arguments[i * 2 + 0];
			value = arguments[i * 2 + 0];
			cssText += name  +": " + value + ";";
		}
		this.style.cssText = cssText;
	}
}
template.call = function(grade, variable, xml, call) {
	var callList = call.split("|");
	var length = callList.length;
	var func, parameters, plength;
	var i, j, is_eval;
	for(i = 0; i < length; i += 2) {
		func = callList[i * 2 + 0];
		parameters = callList[i * 2 + 1].split(",");
		plength = parameters.length;
		for(j = 0; j < plength; ++j) {
			parameters[j] = this.replaceVariable(grade, variable, parameters[j]);
		}
		this.func[func] && this.func[func].apply(xml, parameters);
		
		
	}
}
template.read = function(grade, variable, xml) {
	if(!xml)
		return;
		
		
	if(xml.nodeType !== 1) {
		return;
	}
	var nodeName = xml.nodeName.toLowerCase();
	var cond = xml.getAttribute("cond");
	var call;
	if(cond) {
		var is_result = this.condition(grade, variable, cond);
		call = xml.getAttribute("cond-call");
		xml.removeAttribute("cond-call");
		xml.removeAttribute("cond");
		
		
		if(!is_result && !call) {
			this._remove(xml);
			return;
		}
		if(nodeName === "block" || nodeName === "if") {
			this.readChildren(grade, variable, xml);
			xml.outerHTML = xml.innerHTML;
			return;
		}
		
		if(is_result && call) {
			
			this.call(grade, variable, xml, call);	
		} 
	}
		
	if(call = xml.getAttribute("call")) {
		this.call(grade, variable, xml, call);
		xml.removeAttribute("call");
	}
	switch(nodeName) {
	case "foreach":	
		this.foreach(grade, variable, xml);
		return;
	case "set":
		this.setVariable(grade, variable, xml);
		return;
	case "var":
		this.getVariable(grade, variable, xml);
		return;
	}
	
	
	
	if(xml.getAttribute("foreach") !== null)
		this.foreach(grade, variable, xml);
	this.readChildren(grade, variable, xml);
	return;
}
template.readChildren = function(grade, variable, xml) {
	var childNodes = _concat(xml.childNodes);
	var length = childNodes.length;
	var nextGrade = grade + 1;
	
	variable[nextGrade] = variable[nextGrade] || {};
	
	for(var i = 0; i < length; ++i) {
		daylight.template.read(nextGrade, variable, childNodes[i]);
	}
	delete variable[nextGrade];
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
		value = this.scope(value, _variable, 1);
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
		xml = txt;
	} else {
		xml = document.createElement("div");
		xml.innerHTML = txt;
	}
	info = info || {};
	window.xmlxml = xml;

	
	var variable = {};
	variable.info = info;

	daylight.template.readChildren(0, variable, xml);
	
	if(typeof txt === "object")
		return xml.outerHTML;
	else
		return xml.innerHTML;
}

prototype.templateEngine = function(info, html) {
	this.html("");
	this.append(daylight.templateEngine(info, html));
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
daylight.$TemplateEngine.prototype.compile = function(info) {
	this.html = daylight.template.global(info, this.html);
}
daylight.$TemplateEngine.prototype.global = function(info) {
	return  daylight.template.global(info, this.html);
}
daylight.$TemplateEngine.prototype.process = function(info) {
	var html = this.global(info);
	return daylight.templateEngine(info, html);
}




