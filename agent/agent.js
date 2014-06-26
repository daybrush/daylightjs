var _navigator = daylight._navigator = window.navigator || navigator;
var _userAgent = daylight._userAgent = navigator.userAgent;


//reference to jindo.js jindo._p_._j_ag
daylight._AGENT_IS_IE = /(MSIE|Trident)/.test(daylight._userAgent);
daylight._AGENT_IS_FF = daylight._userAgent.indexOf("Firefox") > -1;
daylight._AGENT_IS_OP = daylight._userAgent.indexOf("Opera") > -1;
daylight._AGENT_IS_SP = daylight._userAgent.indexOf("Safari") > -1;
daylight._AGENT_IS_SF = daylight._userAgent.indexOf("Apple") > -1;
daylight._AGENT_IS_CH = daylight._userAgent.indexOf("Chrome") > -1;
daylight._AGENT_IS_WK = daylight._userAgent.indexOf("WebKit") > -1;
daylight._AGENT_IS_MO = /(iPad|Mobile|Android|Nokia|webOS|BlackBerry|Opera Mini)/.test(daylight._userAgent);

daylight.agent = {};
daylight.agent.isMobile = daylight._AGENT_IS_MO;