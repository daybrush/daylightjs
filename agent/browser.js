

/**


@desc 브라우저 목록과 모바일 인지 아닌지 보여준다.
*/
// reference to jindo.desktop.all.js jindo.$Agent.prototype.navigator
daylight.browser = function() {
	var ver = -1,
		name = "",
		u = _userAgent || "",
		info = {},
		v = _navigator.vendor || "";
		
	function f(browser, userAgent) {
		return ((userAgent || "").indexOf(browser) > -1);
	}
	function hasBrowser(browser) {
		return (u.indexOf(browser) > -1);
	}
	info.webkit = f("WebKit", u);
	info.opera = (window.opera !== undefined) || f("Opera", u);
	info.ie = !info.opera && (f("MSIE", u)||f("Trident", u));
	info.chrome = info.webkit && f("Chrome", u);
	info.safari = info.webkit && !info.chrome && f("Apple", v);
	info.firefox = f("Firefox", u);
	info.mozilla = f("Gecko", u) && !info.safari && !info.chrome && !info.firefox && !info.ie;
	info.camino = f("Camino", v);
	info.netscape = f("Netscape", u);
	info.omniweb = f("OmniWeb", u);
	info.icab = f("iCab", v);
	info.konqueror = f("KDE", v);
	info.mobile = (f("Mobile", u) || f("Android", u) || f("Nokia", u) || f("webOS", u) || f("Opera Mini", u) || f("BlackBerry", u) || (f("Windows", u) && f("PPC", u)) || f("Smartphone", u) || f("IEMobile", u)) && !f("iPad", u);
	info.msafari = ((!f("IEMobile", u) && f("Mobile", u)) || (f("iPad", u) && f("Safari", u))) && !info.chrome;
	info.mopera = f("Opera Mini", u);
	info.mie = f("PPC", u) || f("Smartphone", u) || f("IEMobile", u);
	
	
	try{
		var nativeVersion = -1;
		var dm = document.documentMode;
		if(info.ie){
			if(dm > 0){
				ver = dm;
				if(u.match(/(?:Trident)\/([0-9.]+)/)){
					var nTridentNum = parseFloat(RegExp.$1, 10);
					
					if(nTridentNum > 3){
						nativeVersion = nTridentNum + 4;
					}
				}else{
					nativeVersion = ver;
				}
			}else{
				nativeVersion = ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
			}
		}else if(info.safari || info.msafari){
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			
			if(ver === 100){
				ver = 1.1;
			}else{
				if(u.match(/Version\/([0-9.]+)/)){
					ver = RegExp.$1;
				}else{
					ver = [1.0, 1.2, -1, 1.3, 2.0, 3.0][Math.floor(ver / 100)];
				}
			}
		}else if(info.mopera){
			ver = u.match(/(?:Opera\sMini)\/([0-9.]+)/)[1];
		}else if(info.firefox||info.opera||info.omniweb){
			ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
		}else if(info.mozilla){
			ver = u.match(/rv:([0-9.]+)/)[1];
		}else if(info.icab){
			ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
		}else if(info.chrome){
			ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
		}
		
		info.version = parseFloat(ver);
		info.nativeVersion = parseFloat(nativeVersion);
		
		if(isNaN(info.version)){
			info.version = -1;
		}
	}catch(e){
		info.version = -1;
	}
	
	
	return info;
		
}
