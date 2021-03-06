daylight.ui = daylight.UI = {};
daylight.UI.drag = {};
daylight.UI.resize = {};
daylight.UI.textedit = {};
daylight.UI.drag.dragstart = function(e, data) {
	var dlDragTarget = $(".day-drag").has(e.dragElement, true);
	data.otop = parseFloat(dlDragTarget.css("top")) || 0;
	data.oleft = parseFloat(dlDragTarget.css("left")) || 0;
}
daylight.UI.drag.drag = function(e, data) {
	var dlDragTarget = $(".day-drag").has(e.dragElement, true);
	if(dlDragTarget.size() === 0)
		return;
	dlDragTarget.css("left", data.oleft + e.dragX);
	dlDragTarget.css("top", data.otop + e.dragY);
	
}
daylight.UI.drag.dragend = function(e, data) {
}
daylight.UI.resize.dragstart = function(e, data) {
	var dlResizeTarget = $(".day-resize").has(e.dragElement, true);
	if(dlResizeTarget.size() === 0)
		return;
	var i, length = dlResizeTarget.size(),
		dlRemoveTarget;

	//day-resize 안에 day-reisze가 있는 경우.
	while(dlResizeTarget.size() > 1) {
		for(i = 0; i < length; ++i) {
			dlRemoveTarget = dlResizeTarget.has(dlResizeTarget.get(i));
			if(dlRemoveTarget.size() > 0)
				break;
		}
		//removeLength = dlRemoveTarget.size();
		dlRemoveTarget.each(function() {
			dlResizeTarget.subtract(this);
		});
		length = dlResizeTarget.size();
	}
	
	var dlDragElement = daylight(e.dragElement);

	console.debug("resize");
	data.dlResizeTarget = dlResizeTarget;
	data.owidth = dlResizeTarget.css("width");
	data.oheight = dlResizeTarget.css("height");
	data.otop = dlResizeTarget.css("top");
	data.oleft = dlResizeTarget.css("left");
	data.obottom = dlResizeTarget.css("bottom");
	data.oright = dlResizeTarget.css("right");
	data.pos = dlDragElement.attr("data-direction");	
	
}
daylight.UI.resize.drag = function(e, data) {
	if(!data.dlResizeTarget)
		return;
		
	var dlResizeTarget = data.dlResizeTarget;

	if(dlResizeTarget.size() === 0)
		return;


	while(dlResizeTarget.size() > 1) {
		for(i = 0; i < length; ++i) {
			dlRemoveTarget = dlResizeTarget.has(dlResizeTarget.get(i));
			if(dlRemoveTarget.size() > 0)
				break;
		}
		//removeLength = dlRemoveTarget.size();
		dlRemoveTarget.each(function() {
			dlResizeTarget.subtract(this);
		});
		
		length = dlResizeTarget.size();
	}
	
	var info = data;
	var pos = info.pos;
	var properties = {};
	
	var bPosS = pos.indexOf("s") != -1;
	var bPosW = pos.indexOf("w") != -1;
	var bPosE = pos.indexOf("e") != -1;
	var bPosN = pos.indexOf("n") != -1;
	
	var width = parseFloat(info.owidth);
	var height = parseFloat(info.oheight);
	
	if(bPosE) {
		if(info.oright !== "auto")
			properties.right = parseFloat(info.oright) - e.dragX;
			
		width = width + e.dragX;
		properties.width = width;
	}
	
	if(bPosS) {
		if(info.obottom !== "auto")
			properties.bottom = parseFloat(info.obottom) + e.dragY;
			
		height = height + e.dragY;
		properties.height = height;
	}
	
	if(bPosN) {
		if(info.obottom === "auto")
			properties.top = (parseFloat(info.otop) || 0) + e.dragY;
	
		properties.height = height - e.dragY;
	}
	
	if(bPosW) {
		if(info.oright === "auto")
			properties.left = (parseFloat(info.oleft) || 0) + e.dragX;
	
		width = width - e.dragX;
		properties.width = width;
	}
	
	for(var property in properties) {
		dlResizeTarget.css(property, properties[property] + "px");
	}
	
	dlResizeTarget.trigger("resize", {direction:{n:bPosN, s:bPosS, w:bPosW, e:bPosE}});	
}
daylight.UI.resize.dragend = function(e, data) {
	if(!data.dlResizeTarget)
		return;
		
	data.dlResizeTarget.trigger("endresize");
}

daylight.ui.textedit.setText = function(dlTarget, text) {
	var sPrefix = dlTarget.attr("data-edit-complete-prefix") || "";
	var sSuffix = dlTarget.attr("data-edit-complete-suffix") || "";
	var sDefaultPrefix = dlTarget.attr("data-prefix") || "";
	var sText = sPrefix + text + sSuffix;
	dlTarget.attr("data-text", text);
	if(dlTarget.attr("multiple"))
		sText = sText.replaceAll(" ", "&nbsp;").replaceAll("\n", "<br>");
	dlTarget.html(sDefaultPrefix + sText);
}
daylight.ui.textedit.complete = function(dlTarget) {
	dlTarget.removeClass("day-mode-edit");
	var dlTextEdit = dlTarget.find(".day-textedit");
	var oldVal = dlTarget.attr("data-text");
	var val = dlTextEdit.val();
	daylight.ui.textedit.setText(dlTarget, val);
	daylight.trigger(document, "editComplete", {editTarget: dlTarget, completeText: val, oldText: oldVal});
}
daylight.ui.textedit.completeAll = function() {
	var self = this;
	daylight(".day-text-editable.day-mode-edit").each(function() {
		self.complete(daylight(this));
	})
}
daylight.ui.textedit.cancelAll = function() {
	
}
daylight.ui.textedit.cancel = function(dlTarget) {
	dlTarget.removeClass("day-mode-edit");
	var dlTextEdit = dlTarget.find(".day-textedit");
	var oldVal = dlTarget.attr("data-text");
	daylight.ui.textedit.setText(dlTarget, oldVal);
}
daylight.ui.textedit.edit = function(target) {

	var dlTarget = $(target);
	if(!dlTarget.hasClass("day-text-editable"))
		return;
		
	if(dlTarget.hasClass("day-mode-edit"))
		return;
	dlTarget.addClass("day-mode-edit");
	if(dlTarget.attr("data-text") === null)
		dlTarget.attr("data-text", dlTarget.html());
		
	var sDefaultPrefix = dlTarget.attr("data-prefix") || "";
	if(dlTarget.attr("multiple") === null)
		dlTarget.html(sDefaultPrefix + '<input type="text" class="day-textedit" value="'+(dlTarget.attr("data-text") || "")+'"/>');
	else
		dlTarget.html('<textarea class="day-textedit">'+(dlTarget.attr("data-text") || "")+'</textarea>');
	dlTarget.find(".day-textedit").get(0).focus();

}
daylight.ui.textedit.event = function() {
	var self = this;
	$("body").click(function(e) {
		if(!daylight.hasClass(e.target, "day-text-editable"))
			return;
			
		if(!daylight.hasClass(e.target, "day-mode-edit"))
			return;
		
		daylight.ui.textedit.complete($(e.target));		
	});
	$("body").dblclick(function(e) {
		if(!daylight.hasClass(e.target, "day-text-editable"))
			return;
		
		self.edit(e.target);
	});
	$("body").keyup(function(e) {
		if(!daylight.hasClass(e.target, "day-textedit"))
			return;

		var key = $.Event(e).key();
		var dlTarget = $(e.target).parent();
		if(key.enter) {
			if(dlTarget.attr("multiple") === null)
				daylight.ui.textedit.complete(dlTarget);
		}else if(key.esc) {
			daylight.ui.textedit.cancel(dlTarget);			
		}
	});
	$("body").on("textedit", function(e) {
		console.log("edit");
		self.edit(e.editTarget);
	});
	$("body").on("completeAll", function(e) {
		self.completeAll();
	});
 	$(document).on("editCancel", function(e) {
		
	});
}
$(document).ready(function() {
	var dlBody = $("body");
	var draggable = new Draggable(dlBody);
	var is_drag_start = false;
	var otop, oleft;
	$("[data-templates]").each(function(e) {
		var target = $(this);
		var html =  target.html();
		html = html.replaceAll("img-src", "src");
		var info = target.attr("data-templates");
		target.attr("data-templates", "");
		try {
			var json = JSON.parse(info);
			target.template(json, html);
		} catch(e) {
			console.log(e);
			alert("실패" + info);
		
		}

	});
	draggable.dragstart(function(e, data) {
	
		e.stopPropagation();
		
		var dlElement = $(e.dragElement);
		if(dlElement.hasClass("day-drag-draggable"))
			daylight.UI.drag.dragstart(e, data);
		else if(dlElement.hasClass("day-resize-draggable"))
			daylight.UI.resize.dragstart(e, data);

	});
	draggable.drag(function(e, data) {
		e.stopPropagation();
		
		var dlElement = $(e.dragElement);
		if(dlElement.hasClass("day-drag-draggable"))
			daylight.UI.drag.drag(e, data);
		else if(dlElement.hasClass("day-resize-draggable"))
			daylight.UI.resize.drag(e, data);
	});
	draggable.dragend( function(e) {
		e.stopPropagation();
		
		var dlElement = $(e.dragElement);
		if(dlElement.hasClass("day-drag-draggable"))
			daylight.UI.drag.dragend(e, data);
		else if(dlElement.hasClass("day-resize-draggable"))
			daylight.UI.resize.dragend(e, data);
	});
	//for daylight.css
	$("[data-toggle]").click(function(e) {
		var dlElement = daylight(e.target);

		var selector = dlElement.attr("data-target");
		if(!selector)
			return;
		var toggle = dlElement.attr("data-toggle");
		if(!toggle)
			return;	
		daylight(selector).toggleClass(toggle);
		return;
	});
	$("[role=\"modal\"]").click(function(e) {
		var target = e.target || e.srcElement;
		var dlModal = $(this);
		if(target.getAttribute("data-close") != null) {
			dlModal.removeClass("show");
		}
		var dlElement = daylight(this);
		var selector = dlElement.attr("data-target");
		if(!selector)
			return;
		var toggle = dlElement.attr("data-toggle");		
		daylight(selector).toggleClass(toggle);
		return;
	});
	daylight.ui.textedit.event();
});