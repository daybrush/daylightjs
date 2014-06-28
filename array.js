daylight.extend({
	merge: function(result, data) {
		var length = result.length;
		var length2 = data.length;
		for(var i = 0 ; i < length2; ++i)
			result[length++] = data[i];
		
		return result;
	},
	makeArray: function(arr) {
		var result = [];
		this.merge(result, arr);
		
		return result;
	},
	//해당 index를 보여줍니다.
	index: function(arr, object) {
		var type = _checkType(arr);
		
		//indexOf라는 함수가 index와 같다.
		if(arr.indexOf)
			return arr.indexOf(object);
		
		if(type === "object") {
			//key value 쌍을 이루는 plainObject 일 것이다.
			for(var key in arr) {
				if(arr[key] === object)
					return key;
			}
			return "";
		} else {
			var length = arr.length;
			
			for(var i = 0; i < length; ++i) {
				if(arr[i] === object)
					return i;
			}
			//못찾으면 -1을 반환.
			return -1;
		}
	}
});

prototype.extend({
	toArray: function() {
		return daylight.makeArray(this);	
	}
});