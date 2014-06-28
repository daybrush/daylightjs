function getTime(func, c) {
	var count = c ? c : 10000;
	var start = Date.now();
	for(var i = 0; i < count; ++i) {
		func();
	}
	var end = Date.now();
	return end - start;		
}t = $t = $test = function(name, count) {
	var cl = arguments.callee;
	if (name instanceof cl) return name;
	if (!(this instanceof cl)) return new cl(name, count);
	
	if(count)this.speedCount = count;
	 this.name = name;
}
var testConsole = null;
$test.prototype = {
	speedCount : 10000,
	setConsole : function(element) {
		testConsole = element;
	}
	,viewConsole : function (string, isPass) {
		var style = isPass ? "color:green;" : "color:#f00";
		var result = isPass ? "PASS" : "NOT PASS";
		
		string = daylight.replace("<", "&lt;", string);
		string = daylight.replace(">", "&gt;", string);	
		
		var message =  this.name + " : " + result+"  "+string;

		console.log("%c"+ message, style);
		
		if(testConsole) {
			var nodeName = testConsole.o[0].nodeName;
			if(nodeName === "TABLE") {
				var thisFunction = arguments.callee;
				var caller = thisFunction.caller;
				testConsole.append("<tr style='"+style+"'><td>"+ this.name + "</td><td>"+ result +"</td><td>"+string+"</td><td>"+daylight.index(this.__proto__, caller)+"</td></tr>");
			} else {
				testConsole.append("<p style='"+style+"'>"+ message + "</p>");
			}
		}
	}
	, assertEqual : function (a, b) {
		var result = a===b;
		if(result)this.viewConsole(a + " === " + b, true);
		else this.viewConsole(a + " === " + b, false);
	}
	,assertNotEqual :function (a, b) {
		var result = !(a===b);
			if(result)this.viewConsole(a + " !=== " + b, true);
		else this.viewConsole(a + " === " + b, false);
	}
	,assertTrue : function (a) {
		if(a) this.viewConsole(a + " is True", true);
		else this.viewConsole(a + " is False", false);
	} 
	,assertFalse: function (a) {
		if(a) this.viewConsole(a + " is True", false);
		else this.viewConsole(a + " is False", true);
	} 
	,assertIsNull : function (a) {		if(a === null)	this.viewConsole(a + "is Null", true);		else this.viewConsole(a + "is Not Null", false);	}	,assertIsNotNull :function (a) {		if(a === null)	this.viewConsole(a + "is Null", false);		else this.viewConsole(a + "is Not Null", true);	}	,assertIn :function (a,b) {		if(b.indexOf(a) >= 0) this.viewConsole(a + " in " + b, true);		else this.viewConsole(a + " is not in " + b, false);  	}	,assertNotIn :function (a,b) {		if(b.indexOf(a) >= 0) this.viewConsole(a + " in " + b, false);		else this.viewConsole(a + " is not in " + b, true);  	}	,assertListEqual:function (a, b) {		if(a.length != b.length) {			this.viewConsole(a + "'s legnth (" + a.length + ") is not same " + b +"'s length ( " + b.length + ")", false);			return false;		}		for(var i = 0; i < a.length; ++i) {			if(!(a[i] === b[i])) {				this.viewConsole("index (" + i + ") " + a[i] + " is Not Same " + b[i], false);				return false;			} 		}		this.viewConsole(a + " is equal " + b, true);	}	,assertDictEqual:function (a, b) {		for(var key in a) {			if(!(a[key] === b[key])) {				this.viewConsole(a[key] + "is not same " + b[key], false);				return false;			}		}		this.viewConsole(a + " is same " + b, true);	}
	,assertSpeed : function(func, wantTime) {
		var count = this.speedCount;
		var start = Date.now();
		for(var i = 0; i < count; ++i) {
			func();
		}
		var end = Date.now();
		
		var spendTime = end - start;
		
		if(daylight.type(wantTime) === "function") {
			wantTime = getTime(wantTime, count);	
		}
		var string = (func + "");
		string = daylight.replace("\n", "", string);
		string = string.substr(13, string.length);		if(wantTime == undefined ) this.viewConsole("spendTime("+spendTime+"ms)", true);
		else if(spendTime <= wantTime) this.viewConsole("spendTime("+spendTime+"ms) <=" + wantTime +"ms", true);
		else  this.viewConsole("spendTime("+spendTime+"ms) > " + wantTime +"ms", false);
	}
};
var unittest = $test("UnitTest");
$.each($test.prototype, function(value, key, arr) {
	if(daylight.type(value) != "function")
		return;
		
	window[key] = value.bind(unittest);
});/*assertIsNone(x)	x is None	2.7
assertIsNotNone(x)	x is not None	2.7
assertIn(a, b)	a in b	2.7
assertNotIn(a, b)	a not in b	2.7
assertIsInstance(a, b)	isinstance(a, b)	2.7
assertNotIsInstance(a, b)	not isinstance(a, b)	2.7


assertAlmostEqual(a, b)	round(a-b, 7) == 0	 
assertNotAlmostEqual(a, b)	round(a-b, 7) != 0	 
assertGreater(a, b)	a > b	2.7
assertGreaterEqual(a, b)	a >= b	2.7
assertLess(a, b)	a < b	2.7
assertLessEqual(a, b)	a <= b	2.75432
assertRegexpMatches(s, r)	r.search(s)	2.7
assertNotRegexpMatches(s, r)	not r.search(s)	2.7
assertItemsEqual(a, b)	sorted(a) == sorted(b) and works with unhashable objs	2.7
assertDictContainsSubset(a, b)	all the key/value pairs in a exist in b	2.7


assertListEqual(a, b)	lists	2.7
assertTupleEqual(a, b)	tuples	2.7
assertSetEqual(a, b)	sets or frozensets	2.7
assertDictEqual(a, b)	dicts	2.7*/