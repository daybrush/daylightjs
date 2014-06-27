//@{template/XMLParser.js}

txt="<note cond='{a}!={b}'>";
txt+="<set name='abc'>Tove</set>";
txt+="<from>Jani</from>";
txt+="<foreach  var='item' items='{items}'>";
	txt+="<var name='abc'/>";
txt+="</foreach>";
txt+="<body>Don't forget me this weekend!</body>";
txt+="</note>";
var template = daylight.template;
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
template.changeVariable = function(grade, variable, text) {
	var variables = text.match( /{(.+?)}/gi) || [];
	var length = variables.length;
	var _variable;
	for(var i = 0; i < length; ++i) {
		_variable = variables[i].replace("{", "").replace("}", "");

		_variable = this.getTextVariable(grade, variable, _variable);
		text = text.replace(variables[i], _variable);
	}
	
	return text;
}
template.replaceVariable = function(grade, variable, text) {
	var variables = text.match( /\{(.+?)\}/gi) || [];
	var length = variables.length;
	var _variable;
	for(var i = 0; i < length; ++i) {
		_variable = variables[i].replace("{", "").replace("}", "");

		_variable = this.variable(grade, variable, _variable);
		text = text.replace(variables[i], _variable);
	}
	
	return text;
}
template.getTextVariable = function(grade, variable, name) {
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
template.variable = function(grade, variable, name) {
	var length = grade;
	for(var i = grade; i >= 0; i--) {
		if(!variable.hasOwnProperty(i))
			continue;
		
		if(!variable[i])
			continue;
		
		if(!variable[i].hasOwnProperty(name))
			continue;
			
		
		return variable[i][name];
	}
	
	return variable.info[name];
}
template.condition = function(grade, variable, cond) {
	cond = this.changeVariable(grade, variable, cond);
	try {
		var v = !!eval(cond);
	}catch(e) {
		console.error("error :", cond)
	}
	return v;
}
template.loop = function(grade, variable, xml, from, to, addition) {
	from = this.changeVariable(grade, variable, from);
	from = eval(from);
	
	to = this.changeVariable(grade, variable, to);
	to = eval(to);

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
	items = this.changeVariable(grade, variable, items);
	items = eval(items);
	var type = daylight.type(items);
	
	var cloneXML;
	var cloneHTML = "";
	for(var key in items) {
		cloneXML = (xml.cloneNode(true));
		this.defineVariable(grade + 1, variable, name, items[key]);
		this.defineVariable(grade + 1, variable, "key", key);
		this.readChildren(grade, variable, cloneXML);
		cloneHTML += cloneXML.innerHTML;
	}
	//var elements = daylight.parseHTML(cloneHTML);
	xml.outerHTML = cloneHTML;
}
template.defineVariable = function(grade, variable, name, value) {
	variable[grade] = variable[grade] || {};
	variable[grade][name] = value;
	
	//console.debug("defineVariable",grade, name, variable[grade][name]);
}
daylight.template.setVariable = function(grade, variable, xml) {
	
	var name = xml.getAttribute("name");
	if(name === null || name === "")
		return;
	
	var value = xml.innerText || xml.getAttribute("value");
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
	
	//console.debug(grade, "setVariable", name, value);
}
daylight.template.getVariable = function(grade, variable, dom) {
	var name = dom.innerText || dom.getAttribute("name");
	if(name === null || name === "") {
		dom.outerHTML = "";
		return;
	}
		
	var value = template.variable(grade, variable, name);
	
	//console.debug(grade, "getVariable", name, value);
	dom.outerHTML = value;

}
daylight.template.read = function(grade, variable, xml) {
	if(!xml)
		return;
		
		
	if(xml.nodeType !== 1) {
		//xml.wholeText = template.changeVariable(grade, variable, xml.wholeText);
		//console.log("pass", xml, xml.nodeType);
		return;
	}
	var nodeName = xml.nodeName.toLowerCase();
	var cond = xml.getAttribute("cond");
	if(cond) {
		var is_result = this.condition(grade, variable, cond);
		//console.log(is_result);
		if(!is_result) {
			this._remove(xml);
			return;
		}
		if(nodeName === "block") {
			this.readChildren(grade, variable, xml);
			xml.outerHTML = xml.innerHTML;
			return;
		}
		xml.removeAttribute("cond");
	}
		
	//console.log(nodeName);
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
	this.readChildren(grade, variable, xml);
	return;
}
daylight.template.readChildren = function(grade, variable, xml) {
	var childNodes = _concat(xml.childNodes);
	var length = childNodes.length;
	var nextGrade = grade + 1;
	
	variable[nextGrade] = variable[nextGrade] || {};
	
	for(var i = 0; i < length; ++i) {
		daylight.template.read(nextGrade, variable, childNodes[i]);
	}
	delete variable[nextGrade];
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
	

	return xml;
}

//daylight.templateEngine({a:"1", b:2, items:[1,2,3]}, txt);