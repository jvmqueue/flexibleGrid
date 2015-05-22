var mzc = mzc || {};
mzc.main = (function(w, d, $){
	var Model = Backbone.Model.extend({
	    defaults:{
	      PDF:'docs/yourResumeGoesHere.pdf',
	      WORD:'docs/yourResumeGoesHere.doc',
	      heading:{}
	  	},
	   	changeTitle:function(){
	    	console.log('CHANGE TITLE MODEL LISTENER');
	   	},
		getData:function(options){
			var that = this;
			var noCache = new Date().getMilliseconds();
			$.ajax({
				url:'data/resume.xml?noCache=' + noCache,
				context:d.body,
				'text.xml':jQuery.parseXML,
				crossDomain:false,
				dataType:'xml',
				ifModified:true,			
				success:function(paramData){
					var nodeName = options.xmlNodeName;
					var jsonResponse = mzc.util.fnc.convertXmlToJson(paramData, nodeName);
					that.jsonResponse = jsonResponse;
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

		}, // End getFile
	    initialize:function(){

	    }		
	});

	var View = Backbone.View.extend({
		model:new Model(),
		el:$('#jumbotron .variableData'),
		containerBtn:$('#jsContainerBtnShowDownLoad'),
		selectorBtnDownLoad:'#btnShowDownloadForm',
		selectorBtnFormClose:'#btnClose, #btnClose1, #screen',
		selectorBtnDownLoadFile:'#modalListContainer',
		selectorNodeScreenMask:'#screenModalBackground',
		selectorFormDownLoad:'#frmScreen',
		main:function(){
			this.addListeners();
			var that = this;
			var data = null;
			this.model.getData({xmlNodeName:'title'});

			var interval = w.setInterval(function(){ // wait for data to come back from model
				if(!!that.model.jsonResponse){
					w.clearInterval(interval);
					data = that.model.jsonResponse;
					// setData sets data on model
					that.setData(data);
				}
			}, 333);
		},
		initialize:function(){
			this.main();
		},
		events:{

		},
		render:function render(e){
			var thisView = this.data; // scoping: sending view instance during listener definition
			var data = this.data.model.get('heading'); // data from model which converted XML to JSON
 			var template = _.template( $('#templateTry').html() ); // templates have html as arg
 			var collection = ''; // used to concatenate templates

 			for(var name in data){ // could use .each, but this is more readable, more efficient
 				collection += template(anyVal = data[name]);
 			}

 			thisView.$el.html(collection); // append with our html string
 			thisView.containerBtn.removeClass('hide');
		},
		setData:function(paramObj){
			var data = paramObj;
			for(var name in data){
				this.model.attributes.heading[name] = data[name];
			}
			this.model.trigger('change:heading'); // trigger manually because we are not using set method
		},
		openDownLoadForm:function(e){
			// open model
			var that = e.data.context;
			$(that.selectorFormDownLoad).addClass('jsContainerModelShow');
			$(that.selectorNodeScreenMask).addClass('jsContainerModelShow').removeClass('hide');
		},
		closeDownLoadForm:function(e){
			var that = e.data.context;
			$(that.selectorFormDownLoad).removeClass('jsContainerModelShow');
			$(that.selectorNodeScreenMask).addClass('hide');
		},
		keyEventCloseModel:function(e){
			var that = e.data.context;
			if(e.keyCode === 27){
				that.closeDownLoadForm(e);
			}else{
				return false;
			}
		},
		downloadFile:function(e){
			var that = e.data.context;
			var strInnerHtml = e.target.innerHTML.toUpperCase();

			if(!!that.model.get(strInnerHtml) === true){
				strUrl = that.model.get(strInnerHtml);
			}else{
				throw new Error('Exception: main View.downloadFile discovered value not in model');
			}

			// visitor's monitor screen width
			var screenDim = {width:screen.width, height:screen.height};
			// visitor's monitor screen height
			
			var nameWindow = "newWindow";
			var myWindow = window.open(strUrl, nameWindow, 'toolbar=yes, directories=yes, location=yes, status=yes, menubar=yes, resizable=yes, scrollbars=yes, width='+screenDim.width+', height='+screenDim.height+', screenX=0,screenY=0,left=0,top=0');
			myWindow.focus();
		},
		addListeners:function(){
			var that = this;
			mzc.util.fnc.setListener({selector:this.selectorBtnDownLoad, 
				event:'click', 
				data:{context:that}, 
				listener:that.openDownLoadForm
			});
			mzc.util.fnc.setListener({selector:that.selectorBtnFormClose + ', ' + that.selectorNodeScreenMask, 
				event:'click', 
				data:{context:that}, 
				listener:that.closeDownLoadForm
			});	
			mzc.util.fnc.setListener({selector:that.selectorBtnDownLoadFile, 
				event:'click', 
				data:{context:that}, 
				listener:that.downloadFile
			});			
			mzc.util.fnc.setListener({selector:'#index', 
				event:'keyup', 
				data:{context:that}, 
				listener:that.keyEventCloseModel
			});
			/* avoid using generic event, otherwise it will be triggered everytime we affect model data */
			that.model.on('change:heading', that.render, {data:that});
		}
	});

	var main = function(){
		var view = new View();
	};

	var interval = w.setInterval(function(){ // wait for DOM, we do not need jQuery for this
		if( d.getElementsByTagName('div').length > 0 ){
			w.clearInterval(interval);
			main();
		}
	}, 333);

})(window, document, jQuery);