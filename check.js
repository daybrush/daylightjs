daylight.extend({
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
	}
});