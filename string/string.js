/*String 관련 함수*/
daylight.extend({
/**
* @method
* @name daylight.isPlainObject
*
* @param {String} from 바뀔문자
* @param {String} to 바꿀문자
* @param {String} target 문자열
*
* @retruns {String} 바뀐 문자를 리턴
* @desc from이 들어간 문자를 to로 전부 바꿔준다.
*/	
replace: function(from, to, str) {
	if(!str)
		return "";
	return str.split(from).join(to);
},
/**
* @method
* @name daylight.repeat
*
* @param {String} 반복할 문자
* @param {Number} 반복 횟수
*
* @retruns {String} 반복한 문자
* @desc 반복 횟수만큼 문자를 반복한다.
*/	
repeat: function(str, num) {
	var sWord = "";
	for(var i = 0; i < num; ++i) {
		sWord += daylight.replace("{count}", i + 1, str);
	}
	return sWord;
}
});