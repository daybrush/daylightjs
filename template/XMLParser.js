daylight.parseXML = function(xml) {
	if(typeof xml === "object")
		return xml;
		
	var xmlDoc;
	if (window.DOMParser) {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(xml, "text/xml");
	}
	else {
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(xml);
	}
	return xmlDoc;
}
daylight.parseXMLtoHTML = function(xml) {
	var div = document.createElement("div");
	div.appendChild(xml);
	return div.childNodes[0];
}