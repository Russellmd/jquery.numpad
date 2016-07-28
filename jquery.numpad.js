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
      buttonTextClear: "Clear",

      buttonAllowDone: true,
      buttonTextDone: "Done",

      buttonTextBack: "Delete",
      buttonImageBack: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgYmFzZVByb2ZpbGU9InRpbnkiIGhlaWdodD0iMjRweCIgaWQ9IkxheWVyXzEiIHZlcnNpb249IjEuMiIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGc+PHBhdGggZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBkPSJNMTksMjFIOWMtMS40MzYsMC0zLjE0NS0wLjg4LTMuOTc3LTIuMDQ2bC0yLjYxOS0zLjY2N2MtMC42MjktMC44ODEtMS4xNTctMS42MjEtMS4xODgtMS42NjEgICBjLTAuMjQ2LTAuMzQ0LTAuMjQ5LTAuODk0LTAuMDA4LTEuMjQxYzAuMDE4LTAuMDI1LDAuNTYxLTAuNzgzLDEuMjA0LTEuNjg2bDIuNjA4LTMuNjUzQzUuODU1LDUuODc5LDcuNTY2LDUsOSw1aDEwICAgYzEuNjU0LDAsMywxLjM0NiwzLDN2MTBDMjIsMTkuNjU0LDIwLjY1NCwyMSwxOSwyMXogTTMuMjI5LDEyLjk5OWMwLjIxNSwwLjI5OSwwLjQ5OCwwLjY5NiwwLjgwNiwxLjEyNWwyLjYxOCwzLjY2NyAgIEM3LjEwNCwxOC40MjQsOC4yMjMsMTksOS4wMDEsMTloMTBjMC41NTIsMCwxLTAuNDUsMS0xLjAwMVY4YzAtMC41NTEtMC40NDgtMS0xLTFoLTEwQzguMjI1LDcsNy4xMDQsNy41NzYsNi42NSw4LjIwOSAgIGwtMi42MDgsMy42NTJDMy43MywxMi4yOTcsMy40NDMsMTIuNjk5LDMuMjI5LDEyLjk5OXoiLz48L2c+PHBhdGggc3Ryb2tlPSIjZmZmZmZmIiAgZD0iTTEzLjcwNywxM2wyLjY0Ni0yLjY0NmMwLjE5NC0wLjE5NCwwLjE5NC0wLjUxMiwwLTAuNzA3Yy0wLjE5NS0wLjE5NC0wLjUxMy0wLjE5NC0wLjcwNywwTDEzLDEyLjI5M2wtMi42NDYtMi42NDYgIGMtMC4xOTUtMC4xOTQtMC41MTMtMC4xOTQtMC43MDcsMGMtMC4xOTUsMC4xOTUtMC4xOTUsMC41MTMsMCwwLjcwN0wxMi4yOTMsMTNsLTIuNjQ2LDIuNjQ2Yy0wLjE5NSwwLjE5NS0wLjE5NSwwLjUxMywwLDAuNzA3ICBDOS43NDQsMTYuNDUxLDkuODcyLDE2LjUsMTAsMTYuNXMwLjI1Ni0wLjA0OSwwLjM1NC0wLjE0NkwxMywxMy43MDdsMi42NDYsMi42NDZDMTUuNzQ0LDE2LjQ1MSwxNS44NzIsMTYuNSwxNiwxNi41ICBzMC4yNTYtMC4wNDksMC4zNTQtMC4xNDZjMC4xOTQtMC4xOTQsMC4xOTQtMC41MTIsMC0wLjcwN0wxMy43MDcsMTN6Ii8+PC9zdmc+",
      /* container element settings */
      allowEdit: false,
      /* resulting numpad settings */
      padWidth: null,
      padHeight: null,
      padStyle: null,
      padDisplayOver: true,
      padDisplayOnInit: false
    }, options);

    /* Create buttons structure */
    var numpadButtons = function () {
      var buttons = {}
      		;
      for (var i = 1; i <= 9; i++) {
        buttons['button_' + i] = $('<button type="button" id="numpad__button_' + i + '" value="' + i + '">' + i + '</button>');
      }
      buttons['button_0'] = $('<button type="button" id="numpad__button_0" value="0">0</button>');
      buttons['button_bksp'] = $('<button type="button" id="numpad__button_bksp" value="bksp" style="background-image: url(' + settings.buttonImageBack + ');background-repeat:no-repeat;background-position:5% center;background-size: 20% 90%;">' + settings.buttonTextBack + '</button>');
      if (settings.buttonAllowClear) {
        buttons['button_clr'] = $('<button type="button" id="numpad__button_clr" value="clr">' + settings.buttonTextClear + '</button>');
      }
      if (settings.buttonAllowDone) {
        buttons['button_ok'] = $('<button type="button" id="numpad__button_ok" value="ok">' + settings.buttonTextDone + '</button>');
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
          numpadLines = 6,
          numpadColumns = 3,
          numpadWidth,
          numpadHeight,
          numpadLeft,
          numpadTop
          ;

      /* Init the numpad using current DOM document resolution */
      function init() {
        numpad = $('<div />');

        if(settings.padDisplayOnInit){
        	settings.buttonAllowDone = false;
        	settings.padDisplayOver = false;
        }

        elementWidth = element.outerWidth();
        elementHeight = element.outerHeight();
        elementPosition = element.offset();
        numpadWidth = elementWidth;
        numpadHeight = elementWidth * numpadLines / numpadColumns;
        numpadLeft = elementPosition.left - element.offsetParent().offset().left - (settings.padDisplayOver === true ? 0 : element.position().left);
        numpadTop = settings.padDisplayOver === true ? elementPosition.top + elementHeight - element.offsetParent().offset().top : 0;
        numpadLines = 6 - (settings.buttonAllowClear ? 0 : 1) - (settings.buttonAllowDone ? 0 : 1);

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
          element.triggerHandler('change');
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

        if (settings.padDisplayOnInit) {
          openNumpad();
        } else {
          element.on('click', function (e) {
            if (numpadContainerClone) {
              if (!settings.buttonAllowDone) {
                closeNumpad();
              }
              return false;
            }
            openNumpad();
          });
        }
      }

      function closeNumpad() {
        if (numpadContainerClone) {
          numpadContainerClone.remove();
          numpadContainerClone = null;
        }
      }

      function openNumpad() {
        init();
        numpadContainerClone = numpad.clone(true);
        numpadContainerClone.insertAfter(element);
      }

      $(document).on('click', function (e) {
        if (!($(e.target).attr('id') && $(e.target).attr('id').startsWith('numpad__button_')) && numpadContainerClone && !settings.buttonAllowDone && !settings.padDisplayOnInit && !$(e.target).is($(element))) {
          closeNumpad();
        }
      });

    });
  };
}(jQuery));