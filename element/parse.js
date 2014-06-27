//parse
daylight.extend({
/**
* @method
* @name daylight.parseJSON
*
* @param {String} json
* @retruns {Object} JSON
* @desc 텍스트 형식으로 된 JSON이 Object로 바꿔준다.
*/
	parseJSON : function(text) {
		try {
			//이미 object라면 바꿔줄 필요가 없다.
			if(typeof text === "object")
				return text;
			
			return JSON.parse(text);
		} catch (e) {
			//JSON형식이 아니라면 에러...
			return {};
		}
	},
	/**
	* @method
	* @name daylight.parseHTML
	*
	* @param {String} html
	* @retruns {Element List} Elements
	* @desc 텍스트 형식으로 된 html이 HTML List로 바꿔준다.
	*/
	parseHTML: function(text) {
		var p = document.createElement("p");
		p.innerHTML = text;
		//var arr = _concat(p.childNodes);
		return p.childNodes;
	}

});