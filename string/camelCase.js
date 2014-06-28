daylight.camelCase = function(str) {
	return str.replace(/-+(.)?/g, 
		function(a,b){
			return b?b.toUpperCase():""
	});
}