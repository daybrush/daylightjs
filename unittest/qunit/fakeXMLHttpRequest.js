var FakeXMLHttpRequest = (function(){
	var ajaxData = {};
	var callInfo = {};
	function checkQuestionMark(str){
		return str.indexOf("?") > -1;
	}
	function _XMLHttpRequest(){
		this.callbackData = {};
		this.instanceKey = new Date().getTime() + parseInt(Math.random() * 100000,10);
	}
	_XMLHttpRequest.prototype.open = function(method,url,async){
		this.method = method;
		this.url = url;
		this.async = !!async;
	}
	_XMLHttpRequest.prototype.send = function(param){
		this.param = param||"";		

		if(!callInfo[this.url+(this.param&&checkQuestionMark(this.url)?"":"?")+this.param]){
			callInfo[this.url+(this.param&&checkQuestionMark(this.url)?"":"?")+this.param] = {};
		}
		callInfo[this.url+(this.param&&checkQuestionMark(this.url)?"":"?")+this.param][this.instanceKey] = this;
	}
	_XMLHttpRequest.prototype.addEventListener = function(event,callback){
		if(!this.callbackData[event]){
			this.callbackData[event] = [];
		}
		this.callbackData[event].push(callback);
	}

	return {
		"setup" : function(){
			this._original = window.XMLHttpRequest;
			window.XMLHttpRequest = _XMLHttpRequest;
		},
		"reset" : function(){
			ajaxData = {};
			callInfo = {};
			window.XMLHttpRequest = this._original;
		},
		"set" : function(url,param,type,data){
			if(!ajaxData[type]){
				ajaxData[type] = {};	
			}
			ajaxData[type][url+(param&&checkQuestionMark(url)?"":"?")+param] = data?JSON.stringify(data):"";
		},
		"fire" : function(url,param,type){
			//send에서 fire을 호출하지 않는 이유는 type을 설정할 수 있게 하기 위해서. send에 fire을 하면 onerror을 FakeXMLHttpRequest을 처리할 수 없음.
			param = param||"";
			var key  = url+(param&&checkQuestionMark(url)?"":"?")+param;
			var ajaxs = callInfo[key];
			for(var i in ajaxs){
				ajaxs[i].responseText = ajaxData[type][key];
				ajaxs[i]["callbackData"][type].forEach(function(item){
					item.call(ajaxs[i]);
				});
				delete callInfo[key][i];
			}
		}
	};
})();