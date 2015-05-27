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
            
            if(elm.childNodes.length > 1){
              json = _fnc.getChildNodes(elm.childNodes[0]);
            }
            
          }          
        });
        return json;
      }, // End convertXmlToJson
      intCounter:0,
      xmlNodes:{},
      getChildNodes:function(paramNode){
        var node = paramNode;
        var ELEMENT_NODE = 1;
        var TEXT_NODE = 3;
        if(!!node.nodeName && node.nodeType == ELEMENT_NODE){
          _fnc.xmlNodes[node.nodeName] = node.firstChild.nodeValue;
        }else if(!!node.nodeName && node.nextSibling.nodeType != TEXT_NODE){
          try{
            for(var i = 0, len = node.nextSibling.childNodes.length; i < len; i++){
              if(node.nextSibling.childNodes[i].nodeType == ELEMENT_NODE){
                _fnc.xmlNodes[node.nextSibling.childNodes[i].nodeName] = node.nextSibling.childNodes[i].firstChild.nodeValue;
              }
            }
          }catch(EX){
            //continue;
          }
        }
        if(!!node.nextSibling && !!node.childNodes){
            if(!!node && _fnc.intCounter++ < 3){
              !!node.nextSibling.childNodes[1] ? _fnc.getChildNodes(node.nextSibling.childNodes[1]) : _fnc.getChildNodes(node.nextSibling); 
            }
        }
        return _fnc.xmlNodes;
      },
      getData:function(options){
        var noCache = new Date().getMilliseconds();
        return $.ajax({ // return the response so that callee does not have to look for reponse
            url:options.path + ( !!options.cache ? '' : '?noCache=' + noCache ),
            context:d.body,
            'text.xml':jQuery.parseXML,
            crossDomain:false,
            dataType:( !!options.fileType ? options.fileType : 'xml' ),
            ifModified:true,      
            success:function(paramData){
              
            },
            statusCode:{
              404:function(){
                throw new Error('Exception: 404 - file not found');
              }
            },
            error:function(paramError){                
              throw new Error(
                'Exception: util.getData failed with:' + paramError.statusText +
                ' fileType:\t' + options.fileType +
                '\n, but file came back as:\t' + paramError.responseText
              ); 
            }
          }).done(function(){/* anything after done */});

      } // End getData

  }; // End _fnc

  return{
    fnc:_fnc
  };

})(window, document, jQuery);