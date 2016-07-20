(function ($) {

  $.fn.numpad = function (options) {

    /* Establish our default settings */
    var settings = $.extend({
      /* each button settings */
      buttonWidth: null,
      buttonHeight: null,
      buttonStyle: {
        'background-color': 'black',
        'color': 'white'
      },
      buttonStyleTouch: {
        'background-color': 'white',
        'color': 'black'
      },
      buttonAllowClear: true,
      buttonAllowDone: true,
      /* container element settings */
      allowEdit: false,
      /* resulting numpad settings */
      padWidth: null,
      padHeight: null,
      padStyle: null,
      padDisplayOver: true
    }, options);

    /* Create buttons structure */
    var numpadButtons = function () {
      var buttons = {};
      for (var i = 1; i <= 9; i++) {
        buttons['button_' + i] = $('<button type="button" id="numpad__button_' + i + '" value="' + i + '">' + i + '</button>');
      }
      buttons['button_0'] = $('<button type="button" id="numpad__button_0" value="0">0</button>');
      buttons['button_bksp'] = $('<button type="button" id="numpad__button_bksp" value="bksp">Delete</button>');
      if (settings.buttonAllowClear) {
        buttons['button_clr'] = $('<button type="button" id="numpad__button_clr" value="clr">Clear</button>');
      }
      if (settings.buttonAllowDone) {
        buttons['button_ok'] = $('<button type="button" id="numpad__button_ok" value="ok">Done</button>');
      }

      return buttons;
    };

    return this.each(function () {

      var element = $(this),
          elementWidth,
          elementHeight,
          elementPosition,
          numpadValue = "",
          numpad,
          numpadContainerClone = null,
          numpadLines = 6 - (settings.buttonAllowClear ? 0 : 1) - (settings.buttonAllowDone ? 0 : 1),
          numpadColumns = 3,
          numpadWidth,
          numpadHeight,
          numpadLeft,
          numpadTop
          ;

      /* Init the numpad using current DOM document resolution */
      function init() {
        numpad = $('<div />');
        elementWidth = element.outerWidth();
        elementHeight = element.outerHeight();
        elementPosition = element.offset();
        numpadWidth = elementWidth;
        numpadHeight = elementWidth * numpadLines / numpadColumns;
        numpadLeft = elementPosition.left - element.offsetParent().offset().left - (settings.padDisplayOver === true ? 0 : element.position().left);
        numpadTop = settings.padDisplayOver === true ? elementPosition.top + elementHeight - element.offsetParent().offset().top : 0;

        if (settings.padWidth && parseInt(settings.padWidth)) {
          numpadWidth = settings.padWidth;
        }

        if (settings.padHeight && parseInt(settings.padHeight)) {
          numpadHeight = settings.padHeight;
        }

        if (!(settings.buttonWidth && parseInt(settings.buttonWidth))) {
          settings.buttonWidth = numpadWidth / numpadColumns;
        }

        if (!(settings.buttonHeight && parseInt(settings.buttonHeight))) {
          settings.buttonHeight = numpadHeight / numpadLines;
        }

        var calculatedNumpadWidth = settings.buttonWidth * numpadColumns,
                diffLeft = 0
                ;
        if (calculatedNumpadWidth !== elementWidth) {
          diffLeft = Math.abs(calculatedNumpadWidth - elementWidth) / 2;
          diffLeft *= calculatedNumpadWidth > elementWidth ? -1 : 1;
        }
        if (parseInt(numpadLeft) + diffLeft < 0) {
          diffLeft = 0;
          numpadLeft = 0;
        }

        if (settings.padStyle && typeof settings.padStyle === "object") {
          numpad.css(settings.padStyle);
        }
        numpad.css({
          'position': settings.padDisplayOver === true ? 'absolute' : 'relative',
          'top': numpadTop,
          'left': numpadLeft + diffLeft,
          'zIndex': 9999,
          'marginTop': '2px',
          'marginBottom': '5px',
          'boxSizing': 'border-box'
        })
        .outerWidth(settings.buttonWidth * numpadColumns)
        .height(settings.buttonHeight * numpadLines);

        $.each(numpadButtons(), function (index, button) {
          var buttonWidth = 100 / 3;//settings.buttonWidth;

          if (settings.buttonStyle && typeof settings.buttonStyle === "object") {
            button.css(settings.buttonStyle);
          }
          if (index === 'button_bksp') {
            buttonWidth = buttonWidth * numpadColumns * 2 / 3;
          }
          if (index === 'button_clr' || index === 'button_ok') {
            buttonWidth = buttonWidth * numpadColumns;
          }
          button.height(settings.buttonHeight).width(buttonWidth + "%");
          button.css({
            'float': 'left',
            'box-sizing': 'border-box'
          });

          button.appendTo(numpad);
        });

        numpad.find('button').off('click touchstart keydown mousedown touchend keyup mouseup').on('click', function () {
          var elementOldValue = element.val();

          if ($(this).attr('id') === 'numpad__button_bksp' && $(this).val() === 'bksp') {
            numpadValue = numpadValue.slice(0, -1);
          } else if ($(this).attr('id') === 'numpad__button_clr' && $(this).val() === 'clr') {
            numpadValue = "";
          } else if ($(this).attr('id') === 'numpad__button_ok' && $(this).val() === 'ok') {
            closeNumpad();
            return false;
          } else {
            numpadValue = numpadValue.concat($(this).val());
          }
          element.val(numpadValue);

          var elementNewValue = element.val();
          if (elementOldValue === elementNewValue) {
            numpadValue = numpadValue.slice(0, -1);
            element.val(numpadValue);
          }
        }).on('touchstart keydown mousedown', function () {
          if (settings.buttonStyle && typeof settings.buttonStyle === "object") {
            $(this).parent().find('button').css(settings.buttonStyle);
          }
          if (settings.buttonStyleTouch && typeof settings.buttonStyleTouch === "object") {
            $(this).css(settings.buttonStyleTouch);
          }
        }).on('touchend keyup mouseup', function () {
          if (settings.buttonStyle && typeof settings.buttonStyle === "object") {
            $(this).parent().find('button').css(settings.buttonStyle);
          }
        })
      }

      if (element.prop('tagName') === "INPUT" && $.inArray(element.attr('type').toLowerCase(), ['text', 'number', 'tel', 'password']) !== -1) {
        element.prop('readonly', settings.allowEdit === false ? 'readonly' : false);

        element.on('click', function (e) {
          if (numpadContainerClone) {
            if (!settings.buttonAllowDone) {
              closeNumpad();
            }
            return false;
          }
          init();
          numpadContainerClone = numpad/*Container*/.clone(true);
          numpadContainerClone.insertAfter($(this));
        });

      }

      function closeNumpad() {
        if (numpadContainerClone) {
          numpadContainerClone.remove();
          numpadContainerClone = null;
        }
      }

      $(document).on('click', function (e) {
        if (!($(e.target).attr('id') && $(e.target).attr('id').startsWith('numpad__button_')) && numpadContainerClone && !settings.buttonAllowDone && !$(e.target).is($(element))) {
          closeNumpad();
        }
      });
    });
  };
}(jQuery));