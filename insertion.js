daylight.extend(prototype, {
	before : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element && _type(e) != sDaylight) {
			this.insertHTML("beforebegin", e); 
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target) && target.parentNode)
				target.parentNode.insertBefore(element, target);
		});
		return this;
	},
	prepend : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element && _type(e) != sDaylight) {
			this.insertHTML("afterbegin", e);
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target))
				target.insertBefore(element, target.firstChild);
		});
		return this;
	},
	append : function(obj) {
		var is_element = daylight.isElement(obj);//type 검사
		if(!is_element && _type(obj) != sDaylight) {
			this.insertHTML("beforeend", obj);
			return this;
		}
		_addDomEach(this, obj, function(target, element) {
			if(daylight.isElement(target))
				target.appendChild(element);
		});
		return this;
		
	},
	after : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element && _type(e) != sDaylight) {
			this.insertHTML("afterend", e);
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target) && target.parentNode)
				target.parentNode.insertBefore(element,  target.nextSibling );
		});
		return this;
	},
	insertHTML : function(position, html) {//html 삽입하는 함수
		this.each(function(element) {			
			element.insertAdjacentHTML(position, html);
		});
		return this;
	},
	html: function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.innerHTML = value;
			});
		}
		if(this.length === 0)
			return "";

		if(this.o[0] === undefined)
			return;
		return this.o[0].innerHTML;
	},
	text : function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.innerText = value;
			});
			return this;
		}
		if(this.o[0] === undefined)
			return;
		return this.o[0].innerText;
	},
	ohtml: function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.outerHTML = value;
			});
		}
		if(this.o[0] === undefined)
			return;
		return this.o[0].outerHTML;
	}
});