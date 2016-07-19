(function($) {

    $.fn.numpad = function( options ) {

        // Establish our default settings
        var settings = $.extend({
            buttonWidth: null,
            buttonHeight: null,
            buttonStyle: {
            	'background-color': 'black',
            	'color': 'white'
            },
            allowEdit: false,
            padWidth: null,
            padHeight: null,
            padStyle: null,
            padDisplayOver: true,
            buttonStyleTouch: {
            	'background-color': 'white',
            	'color': 'black'
            }
        }, options);

        var numpadButtons = function(){
        	var buttons = {};
        	for(var i = 1; i <= 9; i++){
        		buttons['button_' + i] = $('<button id="numpad__button_' + i + '" value="' + i + '">' + i + '</button>');
        	}
        	buttons['button_0'] = $('<button id="numpad__button_0" value="0">0</button>');
        	buttons['button_bksp'] = $('<button id="numpad__button_bksp" value="bksp">Delete</button>');
        	buttons['button_clr'] = $('<button id="numpad__button_clr" value="clr">Clear</button>');
        	buttons['button_ok'] = $('<button id="numpad__button_ok" value="ok">Done</button>');

        	return buttons;
        }

        return this.each( function() {

        	var element = $(this),
        		elementWidth,
        		elementHeight,
        		elementPosition,
        		numpadValue = "",
        		numpadContainer,
        		numpadContainerClone = null,
        		numpadLines = 6,
        		numpadColumns = 3,
        		numpadWidth,
        		numpadHeight,
        		numpadLeft,
        		numpadTop;
        		;

        	function init(){
        		numpadContainer = $('<div />'),
        		elementWidth = element.width(),
        		elementHeight = element.outerHeight(),
        		elementPosition = element.offset(),
        		numpadWidth = elementWidth,
        		numpadHeight = elementWidth * numpadLines / numpadColumns,
        		numpadLeft = settings.padDisplayOver === true ? elementPosition.left : elementPosition.left - element.position().left,
        		numpadTop = settings.padDisplayOver === true ? elementPosition.top + elementHeight : 0
        		;
        		//console.log(elementPosition.top +" "+ elementHeight)

        		if(settings.padWidth && parseInt(settings.padWidth)){
	        		numpadWidth = settings.padWidth;
	        	}

	        	if(settings.padHeight && parseInt(settings.padHeight)){
	        		numpadHeight = settings.padHeight;
	        	}
	        	
	        	if(!(settings.buttonWidth && parseInt(settings.buttonWidth))){
	        		settings.buttonWidth = numpadWidth / numpadColumns;
	        	}

	        	if(!(settings.buttonHeight && parseInt(settings.buttonHeight))){
	        		settings.buttonHeight = numpadHeight / numpadLines;
	        	}

                calculatedNumpadWidth = settings.buttonWidth * numpadColumns;
                diffLeft = 0;
                if(calculatedNumpadWidth != elementWidth){
                    diffLeft = Math.abs(calculatedNumpadWidth - elementWidth) / 2;
                    diffLeft *= calculatedNumpadWidth > elementWidth ? -1 : 1;
                }
                if(parseInt(numpadLeft) + diffLeft < 0){
                    diffLeft = 0;
                    numpadLeft = 0;
                }

	        	numpadContainer.css({
	    			'position': settings.padDisplayOver === true ? 'absolute' : 'relative', 
	    			'top': numpadTop, 
	    			'left': numpadLeft + diffLeft, 
	    			'zIndex': 9999,
	    			'margin-top': '2px'
	    		})
	    		.width(settings.buttonWidth * numpadColumns)
	    		.height(settings.buttonHeight * numpadLines);
	    		if(settings.padStyle && typeof settings.padStyle === "object" ){
	    			numpadContainer.css(settings.padStyle);
	    		}

	        	$.each(numpadButtons(), function(index, button){
	        		button.width(settings.buttonWidth);
	        		if(index === 'button_bksp'){
	        			button.width(settings.buttonWidth * 2/3 * numpadColumns);
	        		}
	        		if(index === 'button_clr' || index === 'button_ok'){
	        			button.width(settings.buttonWidth * numpadColumns);
	        		}
	        		button.height(settings.buttonHeight);
	        		if(settings.buttonStyle && typeof settings.buttonStyle === "object" ){
	        			button.css(settings.buttonStyle);
	        		}
	        		button.css('float', 'left');

	        		button.appendTo(numpadContainer);
	        	});

	        	numpadContainer.find('button').off('click touchstart keydown mousedown touchend keyup mouseup').on('click', function(){
            		var elementOldValue = element.val();

            		if($(this).attr('id') === 'numpad__button_bksp' && $(this).val() === 'bksp'){
            			numpadValue = numpadValue.slice(0, -1);
            		}else if($(this).attr('id') === 'numpad__button_clr' && $(this).val() === 'clr'){
            			numpadValue = "";
            		}else if($(this).attr('id') === 'numpad__button_ok' && $(this).val() === 'ok'){
            			numpadContainerClone.remove();
            			numpadContainerClone = null;
            			return false;
            		}else{
            			numpadValue = numpadValue.concat($(this).val());
            		}
            		element.val(numpadValue);

            		var elementNewValue = element.val();
            		if(elementOldValue === elementNewValue){
            			numpadValue = numpadValue.slice(0, -1);
            			element.val(numpadValue);
            		}	
            	}).on('touchstart keydown mousedown', function(){
            		if(settings.buttonStyle && typeof settings.buttonStyle === "object" ){
	            		$(this).parent().find('button').css(settings.buttonStyle);
	            	}
	            	if(settings.buttonStyleTouch && typeof settings.buttonStyleTouch === "object" ){
	            		$(this).css(settings.buttonStyleTouch);
	            	}
            	}).on('touchend keyup mouseup', function(){
            		if(settings.buttonStyle && typeof settings.buttonStyle === "object" ){
	            		$(this).parent().find('button').css(settings.buttonStyle);
	            	}
            	})
        	}
        	

            if(element.prop('tagName') === "INPUT" && $.inArray(element.attr('type').toLowerCase(), ['text', 'number', 'tel', 'password']) !== -1){
            	element.prop('readonly', settings.allowEdit === false ? 'readonly' : false);

            	element.on('focus', function(e){
            		if(numpadContainerClone){
            			return false;
            		}
            		init();
            		numpadContainerClone = numpadContainer.clone(true);
            		numpadContainerClone.insertAfter($(this));
            	}).on('blur', function(e){
            		//numpadContainer.remove();
            	});

            	
            }
        });

    }

}(jQuery));