var mzc = mzc || {};
mzc.main = (function(w, d, $){
	var Model = Backbone.Model.extend({
	    defaults:{
	      PDF:'docs/yourResumeGoesHere.pdf',
	      WORD:'docs/yourResumeGoesHere.doc',
	      heading:{},
	      template:'',
	      templateEducation:'',
	  	},
	   	changeTitle:function(){
	    	console.log('CHANGE TITLE MODEL LISTENER');
	   	},
	    initialize:function(){

	    },
		setData:function(paramObj){
			var data = paramObj;
			var that = this;
			for(var name in data){
				that.attributes.heading[name] = data[name];
			}
			that.trigger('change:heading'); // trigger manually because we are not using set method
		},	    
		getData:function(options){
			var that = this;
			var data = null;

			data = mzc.util.fnc.getData({
				path:options.path, 
				fileType:options.fileType,
				xmlNodeName:options.xmlNodeName, 
				cache:options.cache
			});


			if(options.fileType == 'text'){
				w.setTimeout(function(){

					var reg = /(^|\W)id="(\w+)/g;
					var templateId = reg.exec(data.responseText);
					var strTemplateId = templateId[2];
					switch(strTemplateId){
						case 'templateJumboTron':
							that.set( 'template', $(data.responseText).html() );
							break;
						case 'templateEducation':
							that.set( 'templateEducation', $(data.responseText).html() );
							break;
						default:
							// TODO: model.getData discovered undefined case
					}

				}, 777);
			}

			var interval = w.setInterval(function(){ // wait for data to come back from xmlHttpRequest
				if(!!data.responseXML){
					w.clearInterval(interval);
					data = data.responseXML;
					data = mzc.util.fnc.convertXmlToJson(data, 'title');
					// setData sets data on model
					that.setData(data);
				}
			}, 333);			
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
		template:'',
		main:function(){
			this.addListeners();
			var that = this;
			that.model.getData( {path:'data/resume.xml', fileType:'xml', xmlNodeName:'title', cache:false} );
			that.model.getData( {path:'data/education.xml', fileType:'xml', xmlNodeName:'title', cache:false} );
			w.setTimeout(function(){
				that.model.getData( {path:'templates/titleTemplate.html', fileType:'text', xmlNodeName:'', cache:false} );
			}, 333);
			w.setTimeout(function(){
				that.model.getData( {path:'templates/educationTemplate.html', fileType:'text', xmlNodeName:'', cache:false} );
			}, 444);			

		},
		initialize:function(){
			this.main();
		},
		renderJumboTron:function(){
			var templateHtml = null;
			var template = null;
			
			templateHtml = this.model.get('template');
			template = _.template(templateHtml);
			var data = this.model.get('heading');
			var collection = '';
			for(var name in data){
				collection += template(templateVal = data[name]);
			}
			this.$el.html(collection);
			this.containerBtn.removeClass('hide');
		},
		renderEducation:function(){
			var templateHtml = this.model.get('templateEducation');



		},
		events:{

		},
		renderTemplate:function(e){
			var thisView = this.data; // scoping when we define listener, we send context
			var templateName = this.templateName;

			switch(templateName){
				case 'jumbotron':
					thisView.renderJumboTron();
					break;
				case 'education':
					thisView.renderEducation();
				default:
					/* TODO: throw exception discovered name having no associated template */
			}
			
		},
		render:function render(e){

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

			that.model.on('change:template', that.renderTemplate, {data:that, templateName:'jumbotron'});
			that.model.on('change:templateEducation', that.renderTemplate, {data:that, templateName:'education'});
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