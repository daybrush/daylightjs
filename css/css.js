
var _style = function(element, name) {
	if(!element)
		return;
		
	if(arguments.length === 1)
		return window.getComputedStyle && window.getComputedStyle(element) || element.currentStyle || element.style;
	if(arguments.length === 2)
		return window.getComputedStyle && window.getComputedStyle(element)[name] || element.currentStyle && element.currentStyle[name] || element.style[name];
}

var _curCss = function(element, name, pre_styles) {
	if(!element || !name)
		return;
	//pre_styles
	//element에 대해 미리 정의한 style들의 모음.
	name = daylight.camelCase(name);
	
	var style = pre_styles && pre_styles[name] || _style(element, name) || 0;


	//한 스타일 속성  style.length - 1 = 문자 끝자리가 %
	if(style && style.length && style[style.length - 1] === "%") {
		var percentage = parseFloat(style);
	
		//false Nan까지 고려
		if(percentage == 0)
			return 0 + "px";

		var offset_parent = element.offsetParent || element.parentNode;
			
		var element_styles = _style(offset_parent);
		var dimension = _curCssHook(offset_parent, name, element_styles);
		

		//%로 된 css 속성을 절대값 pixel로 바꿔준다. 크롬은 알아서 픽셀로 바꿔준다.
		return percentage * dimension / 100 + "px";
	}
	
	return style;
}
var _checkBorder = function(border) {
	switch(border) {
	case "thick":
		return "6px";
	case "medium":
		return "4px";
	case "thin":
		return "2px";
	}
	return border;
}
var _dimensionCssHook = function(element, component, pre_styles) {

	var border_left = _curCss(element, "border-"+component[0]+"-width", pre_styles);
	var border_right = _curCss(element, "border-"+component[1]+"-width", pre_styles);

	var border_left_display = _curCss(element, "border-"+component[0], pre_styles);
	var border_right_display = _curCss(element, "border-"+component[1], pre_styles);

	var padding_left = _curCss(element, "padding-"+component[0], pre_styles);
	var padding_right = _curCss(element, "padding-"+component[1], pre_styles);
	
	//NaN과 같은 잘못된 숫자나 그런 것들 고려
	border_left = border_left_display == 0? 0 : _checkBorder(border_left);
	border_right = border_right_display == 0? 0 :_checkBorder(border_right);
	
	var inner = (component[0] === "left") ? $(element).innerWidth() : $(element).innerHeight();
	var dimension = inner - parseFloat(border_left) - parseFloat(border_right) - parseFloat(padding_left) - parseFloat(padding_right);	

	return dimension;
}
var _curCssHook = function(element, name, pre_styles) {
	//content width에 따라 바뀔 수 있는 속성
	var lrtype = ["left", "right", "width", "margin-left", "margin-right", "padding-left", "padding-right"];
	//content height에 따라 바뀔 수 있는 속성
	var tbtype = ["top", "bottom", "height", "margin-top", "margin-bottom", "padding-top", "padding-bottom"];	
	
	

	if(lrtype.indexOf(name) !== -1) {
		var requestComponent = ["left", "right"];
		return _dimensionCssHook(element, requestComponent, pre_styles);
	} else if(tbtype.indexOf(name) !== -1) {
		var requestComponent = ["top", "bottom"];

		return _dimensionCssHook(element, requestComponent, pre_styles);
	} else if(name === "font-size") {

		return _curCss(element.offsetParent, name);
	}

	
	//%를 쓸 수 있는 css 속성이 있는지 확인할 수가 없다 ;;; 조사해보자 ㅠㅠ
	return 0;
}


/**
* @method
* @name daylight.css
*
* @param {Element} HTMLElement
* @param {String} CSS Property
* @retruns {string | undefined} value
* @desc CSS 속성을 가져오거나 CSS 속성에 대해 설정할 수 있다.
*/
daylight.css = function(element, name, value) {
	var type = this.type(name);
	if(type === "object") {
		daylight.each(name, function(value, key) {
			element.style[key] = value;
		});
		return;
	}
	name = daylight.camelCase(name);
	
	//set CSS value가 있으면 style을 정해준다.
	if(value !== undefined && typeof value != "boolean") {
		element.style[name] = value;
		return value;
	}
	//자동 parseFloat을 해준다.
	if(value === true) {
		var returnValue = parseFloat(_curCss(element, name));
		if(!returnValue)//returnValue가 NaN 일경우 returnValue == NaN이 false다 ㅠㅠㅠ NaN일 경우 비교문에서는 false로 나온다.. ㅠㅠㅠ
			return 0;//auto인 경우?
			
		return returnValue;
	}
	return _curCss(element, name);
}



/**
*
* @param {string} property 속성 이름
* @param {string} value 값
* @param {boolean} isNoObject 오브젝트인지 검사를 하는 부분을 제거한다. 기본값 false
* @return {this} 자기 자신
* @desc CSS 변경하거나 CSS값을 가져온다.
*/
prototype.css = function(name, value, isNoObject) {
	if(this.length === 0)
		return;
		
	if(name === undefined)
		return _style(this.get(0));

	if(!isNoObject) {
		var self = this;
		var type = daylight.type(name);
		if(type === "object") {
			//cssText를 이용한 방법
			this.each(function() {
				var element = this;
				var style = element.style;
				var cssText = "";

				var length  = style.length;
				for(var i = 0; i < length; ++i) {
					if(name[style[i]] === 0 || name[style[i]])
						continue;
					name[style[i]] = style[style[i]];
				}
				var property;
				for(property in name) {
					cssText += property + ": " + name[property] +";";
				}
				element.style.cssText = cssText;
			});
			//daylight.each(name, function(value, key) {
			//	self.css(key, value, true);
			//});
			return this;
		}
	}
	name = daylight.camelCase(name);
	if(value !== undefined) {
		this.forEach(function(e) {
			e.style[name] = value;
		});
		return this;
	}
	var e0 = this.get(0);
	if(e0 === undefined)
		return;
		
	return daylight.css(e0, name);
}
