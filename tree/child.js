//child
prototype.extend({
	find: function(query) {
		if(this.length === 1) {
			return this[0].querySelectorAll(query);
		}
		var list = new ElementList();
	
		this.each(function(element, index) {
			var elements = element.querySelectorAll(query);
			elements.each(function(element, index) {
				list.add(element);				
			});
		});
		return list;
	},
	children: function() {
		var o = new ElementList();
		this.each(function(v) {
			if(!daylight.isElement(v))
				return;
				
			var a = this.children;
			var l = a.length;
			for(var i = 0; i < l; ++i)
				o.add(a[i]);
		});
		return o;
	},
	prev: function(nCount) {
		nCount = nCount ? nCount : 1;
		var arr = new ElementList();
		var length = this.length;
		this.each(function(e) {

			if(!daylight.isElement(e))
				return;
				
			if(e.previousElementSibling)
				while((e = e.previousElementSibling) != null && ( --nCount != 0)) {}
			else
				while((e = e.previousSibling) != null && ((e.nodeType === 1 && --nCount != 0) || e.nodeType !== 1)) {}
	
			if(!e)
				return;
				
			if(nCount > 0)
				return;
				
			arr.add(e);
		});
		return arr;
	},
	next : function(nCount) {
		nCount = nCount ? nCount : 1;
		
		var arr = new ElementList();
		var length = this.length;
		this.each(function(e) {
			if(!daylight.isElement(e))
				return;
				
			if(e.previousElementSibling)
				while((e = e.nextElementSibling) != null && ( --nCount != 0)) {}
			else
				while((e = e.nextSibling) !== null &&( (e.nodeType === 1 && --nCount != 0) || e.nodeType !== 1)) {}
			if(!e)
				return;
				
			if(nCount > 0)
				return;
				
			arr.add(e);
		});
		return arr;
	}
});