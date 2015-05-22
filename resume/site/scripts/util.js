var mzc = mzc || {};
mzc.util = (function(w, d, $){

 var _fnc = {
      setListener:function(options){
        $(options.selector).on(options.event, options.data, options.listener);
      },
      convertXmlToJson:function(paramXml, paramNodeName){
        var xml = paramXml.firstChild;
        var xmlParent = xml.getElementsByTagName(paramNodeName)[0];
        var json = {};

    		$(xmlParent.childNodes).each(function(index, elm){
          if(elm.nodeType == 1){          
            json[elm.nodeName] = elm.firstChild.nodeValue;
          }          
        });
    		return json;
    }
  }; // End _fnc

  return{
  	fnc:_fnc
  };

})(window, document, jQuery);