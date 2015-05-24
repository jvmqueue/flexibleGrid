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
      }, // End convertXmlToJson
      getData:function(options){
        var noCache = new Date().getMilliseconds();
        return $.ajax({ // return the response so that callee does not have to look for reponse
            url:options.path + ( !!options.cache ? '' : '?noCache=' + noCache ),
            context:d.body,
            'text.xml':jQuery.parseXML,
            crossDomain:false,
            dataType:'xml',
            ifModified:true,      
            success:function(paramData){
              
            },
            statusCode:{
              404:function(){
                throw new Error('Exception: 404 - file not found');
              }
            },
            error:function(paramError){                
              throw new Error('Exception: util.getData failed with: ' + paramError.statusText); 
            }
          }).done(function(){/* anything after done */});

      } // End getData

  }; // End _fnc

  return{
  	fnc:_fnc
  };

})(window, document, jQuery);