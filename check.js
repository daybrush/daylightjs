daylight.extend({
/**
* @method
* @name daylight.nodeName
*
* @param {element} Element
* @param {element} compareElement
* @retruns {String|Boolean} element의 노드이름을 보여주거나 2번째 인자가 들어오면 비교해서 같으면 true 틀리면 false를 리턴한다.
* @desc element의 노드이름을 보여주거나 2번째 인자가 들어오면 비교해서 같으면 true 틀리면 false를 리턴한다.
*/
	nodeName : function(element, compare) {
		var nodeName = element.nodeName;
		var type = daylight.type(compare);
		if(compare !== undefined) {
			if(type === "object")//비교 대상이 있으면 비교값을 리턴 true, false;
				return nodeName === compare.nodeName;
			else
				return nodeName === compare;
		}
		return nodeName;//비교 대상이 없으면 노드 이름만 반환.
	},
	/**
* @func : daylight.isNode(Node)
* @description : 해당 객체가 Node인지 확인
* @param : Node
* @return : Boolean(노드이면 true 아니면 false)
*/
	isNode : function(o) {
		if(typeof o !== "object")
			return false;
			
		if(o instanceof _Node)
			return true;
			
		return false;
	},
/**
* @method
* @name daylight.isElement
*
* @description : 해당 객체가 Element인지 확인
* @param : Element
* @return : Boolean(Element이면 true 아니면 false)
*/
/**
* @param {*} All
* @retruns {Boolean} if All is Element, True 
* @desc element인지 검사한다.
*/
	isElement : function(o) {
		if(!o)
			return false;
		
		//nodeType 이 1이면 HTMLElement이다.
		if(o.nodeType === 1)
			return true;
	
		return false;
	},
/**
* @method
* @name daylight.isFunction
*
* @param {*} All
* @retruns {Boolean} if All is Function, True 
* @desc Function인지 검사한다.
*/
	isFunction : function(o) {
		return typeof o === "function";
	},
/**
* @method
* @name daylight.isPlainObject
*
* @param {*} All
* @retruns {Boolean} if All is PlainObject, True 
* @desc PlainObject인지 검사한다.
*/	
	isPlainObject: function(n) {
		if(!n)
			return false;
		//PlainObject의 생성자는 Object이다???
		if(n.constructor === Object)
			return true;
	},
	isDaylight: function(obj) {
		var type = _checkType(obj);
		return this.isDaylightType(type);
	},
	isDaylightType: function(type) {
		if(type === "daylight")
			return true;
			
		if(type === "nodelist")
			return true;
		if(type === "elementlist")
			return true;
			
		return false;
	}
});
