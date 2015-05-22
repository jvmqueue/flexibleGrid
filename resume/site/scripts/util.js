var mzc = mzc || {};
mzc.util = (function(w, d, $){
  var _fnc = {
      that:{},
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
      }, // End convertXmlToJson
      getData:function(options){
        var that = this;
        var noCache = new Date().getMilliseconds();
        $.ajax({
          url:options.path + '?noCache=' + noCache,
          context:d.body,
          'text.xml':jQuery.parseXML,
          crossDomain:false,
          dataType:'xml',
          ifModified:true,      
          success:function(paramData){
            var nodeName = options.xmlNodeName;
            // TODO: mzc.util.fnc.convertXmlToJson should be convertXmlToJson, because we are now local
            var jsonResponse = mzc.util.fnc.convertXmlToJson(paramData, nodeName);
            _fnc.that['jsonResponse'] = jsonResponse;
          },
          statusCode:{
            404:function(){console.log('Exception: 404 - file not found');}
          },
          error:function(paraError){
            for(var arg in arguments){
              console.group('ERROR');
                console.log('arguments:\t', arguments[arg]);
              console.groupEnd(); 
            }
          }
        }).done(function(){/* anything after done */});

      } // End getData

  }; // End _fnc

  return{
  	fnc:_fnc
  };

})(window, document, jQuery);