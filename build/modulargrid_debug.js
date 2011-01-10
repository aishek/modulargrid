/** @namespace */
var ModularGrid = {};/** @include "../index.js" */
ModularGrid.Utils = {};/**
 * @include "namespace.js"
 * @include "CookieStore.js"
 * @include "StateChanger.js"
 * @include "EventProvider.js"
 * @include "EventSender.js"
 */
ModularGrid.Utils = {

	updateCSSHeight: function(element, value, callback) {
		if ( element !== null ) {
			element.style.height = value;

			if ( callback )
				callback();
		}
	},

	/**
	 * @return {Number} высота области для сетки в пикселах
	 */
	getClientHeight: function () {
		var height = Math.max(document.documentElement.clientHeight, this.getDocumentBodyElement().offsetHeight);

		if ( window.scrollMaxY )
			height = Math.max(height, window.scrollMaxY);

		if ( document.documentElement.scrollHeight )
			height = Math.max(height, document.documentElement.scrollHeight);

		return height;
	},

	/**
	 * @return {Number} ширина области для сетки в пикселах
	 */
	getClientWidth: function () {
		var width = document.documentElement.clientWidth;
		return width;
	},

	documentBodyElement: null,

	/**
	 * @private
	 * @return {Element} body
	 */
	getDocumentBodyElement: function () {
		if ( this.documentBodyElement == null )
			this.documentBodyElement = document.getElementsByTagName("body")[0];

		return this.documentBodyElement;
	},

	/**
	 * Сливает два хэша
	 * @private
	 * @param {Object} defaults значения по-умолчанию
	 * @param {Object} params переопределенные значения
	 * @return {Object} объект из ключей и значений по-умолчанию и новых значений
	 */
	createParams: function (defaults, params) {
		var result = {};

		for ( var key in defaults )
			result[key] = defaults[key];

		for ( var key in params )
			result[key] = params[key];

		return result;
	},

	defaultStyleValueParams: {
		display: 'block',
		width: '100%',
		height: '100%',
		opacity: 1.0,
		background: 'transparent',
		'float': 'none',
		visibility: 'visible',
		border: '0'
	},

	/**
	 * Возвращает CSS-строку для свойства style
	 * @private
	 * @param {Object} params параметры для строки
	 * @return {String} CSS-строка для свойства style
	 */
	createStyleValue: function (params, defaultParams) {
		var fromParams = defaultParams || ModularGrid.Utils.defaultStyleValueParams;
		var styleParams = ModularGrid.Utils.createParams(fromParams, params);

		var result = '';
		for (var key in styleParams) {
			if ( styleParams[key] || styleParams[key] === 0 )
				result += key + ':' + styleParams[key] + ';';

			if ( styleParams[key] == 'opacity')
				result += '-khtml-opacity:' + styleParams[key] + ';-moz-opacity:' + styleParams[key] + ';filter:progid:DXImageTransform.Microsoft.Alpha(opacity=' + (styleParams[key] * 100) + ');';
		}

		return result;
	}

};/** @include "index.js" */

/**
 * Обертка события от браузера.
 * @constructor
 * @param {String} eventName название события, например "keydown"
 * @param {Function} prepareParams преобразователь event браузера в хеш для обработчика
 * @return {ModularGrid.EventProvider}
 */
ModularGrid.Utils.EventProvider = function(eventName, prepareParams, target) {
	this.eventName = eventName;
	this.prepareParams = prepareParams;
	this.target = target || 'document';

	this.handlers = null;

	return this;
};

/**
 * Формирует хеш параметоров с помощью this.prepareParams и вызывает все обработчики
 * @private
 * @param {Object} event
 */
ModularGrid.Utils.EventProvider.prototype.genericHandler = function(event) {
	var params = (this.prepareParams ? this.prepareParams(event) : event);

	for(var i = 0, length = this.handlers.length; i < length; i++)
		this.handlers[i](params);
};

/**
 * Создает массив обработчиков, вешает обработчик события браузера
 * @private
 */
ModularGrid.Utils.EventProvider.prototype.initHandlers = function () {
	this.handlers = [];

	var code = this.target + '.on' + this.eventName.toLowerCase() +  '=function(event){self.genericHandler(event);};';

	var self = this;
	eval(code);
};

/**
 * Добавляет обработчик события в конец очереди обработчиков
 * @param {Function} handler обработчик события
 */
ModularGrid.Utils.EventProvider.prototype.addHandler = function (handler) {
	if ( this.handlers == null )
		this.initHandlers();

	this.handlers[this.handlers.length] = handler;
};/** @include "index.js" */

/**
 * Объект, который умеет посылать события.
 * @constructor
 * @return {ModularGrid.EventSender}
 */
ModularGrid.Utils.EventSender = function() {
	this.handlers = {};

	return this;
};

/**
 * Добавляет обработчик события в конец очереди обработчиков
 * @param {String} eventName название события
 * @param {Function} handler обработчик события
 */
ModularGrid.Utils.EventSender.prototype.addHandler = function (eventName, handler) {
	if ( !this.handlers[eventName] ) {
		this.handlers[eventName] = [];
	}

	this.handlers[eventName][this.handlers[eventName].length] = handler;
};

/**
 * Вызывает обработчики события с указанными параметрами
 * @param {String} eventName название события
 * @param {Object} params параметры обработчиков событий
 */
ModularGrid.Utils.EventSender.prototype.occurEvent = function (eventName, params) {
	var target = this.handlers[eventName];

	if ( this.handlers[eventName] ) {
		for(var i = 0, length = this.handlers[eventName].length; i < length; i++ ) {
			this.handlers[eventName][i](params);
		}
	}
};/** @include "index.js" */

ModularGrid.Utils.CookieStore = {

	setValue: function(name, value) {
		ModularGrid.Utils.CookieStore.setCookie(name, value)
	},

	getValue: function(name) {
		return ModularGrid.Utils.CookieStore.getCookie(name);
	},

	/**
	 * Backend to save value
	 * @private
	 * @param {String} name имя сохраняемой переменной
	 * @param {Object} value занчение сохраняемой переменной
	 */
	setCookie: function(name, value) {
		var today = new Date(), expires = new Date();
		expires.setTime(today.getTime() + 31536000000); //3600000 * 24 * 365

		document.cookie = name + "=" + escape(value) + "; expires=" + expires;
	},

	/**
	 * Backend to restore value
	 * @private
	 * @param {String} name имя сохранённой переменной
	 * @return {Object} значение сохранённой переменной
	 */
	getCookie: function(name) {
		var cookie = " " + document.cookie;
		var search = " " + name + "=";
		var setStr = null;
		var offset = 0;
		var end = 0;

		if (cookie.length > 0) {
			offset = cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = cookie.indexOf(";", offset)
				if (end == -1) {
					end = cookie.length;
				}
				setStr = unescape(cookie.substring(offset, end));
			}
		}

		return(setStr);
	}

};/** @include "index.js" */

/**
 * Меняет состояние объекта по внешнему событию.
 * @constructor
 * @param {ModularGrid.EventProvider} eventProvider прослойка, чье событие слушать
 * @param {Function} shouldChange если вернет true при возникновении события от eventProvider, то вызовится stateChange
 * @param {Function} stateChange вызывается, когда нужно поменять состояние
 * @return {ModularGrid.StateChanger}
 */
ModularGrid.Utils.StateChanger = function (eventProvider, shouldChange, stateChange) {
	eventProvider.addHandler(
		function (params) {
			if ( shouldChange(params) )
				stateChange();
		}
	);

	return this;
};
/** @include "../index.js" */

ModularGrid.OpacityChanger = {};/** @include "index.js" */

ModularGrid.OpacityChanger.defaults = {
	/**
	 * Функция вызывается каждый раз при нажатии клавиш в браузере.
	 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
	 * @return {Boolean} true, если нужно сделать изображение менее прозрачным на opacityStep процентов
	 */
	shouldStepUpOpacity:
		function (params) {
			// Shift + ]
			var result = !params.occured_in_form && (params.shiftKey && params.keyCode == 221);
			return result;
		},
	/**
	 * Функция вызывается каждый раз при нажатии клавиш в браузере.
	 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
	 * @return {Boolean} true, если нужно сделать изображение более прозрачным на opacityStep процентов
	 */
	shouldStepDownOpacity:
		function (params) {
			// Shift + [
			var result = !params.occured_in_form && (params.shiftKey && params.keyCode == 219);
			return result;
		},

	/**
	 * Начальное значение прозрачности изображения от 0 до 1 (0 - абсолютно прозрачное, 1 - абсолютно непрозрачное)
	 * @type Number
	 */
	opacity: 0.25,
	/**
	 * Шаг изменения значения прозрачности для изображения от 0 до 1
	 * @type Number
	 */
	opacityStep: 0.05
};ModularGrid.OpacityChanger = {

	params: null,

	/** @type {ModularGrid.Utils.EventSender} */
	eventSender: null,

	/**
	 * Устанавливает настройки для гайдов
	 *
	 * @param {Object}
	 *            params параметры гайдов
	 */
	init: function(params) {
		this.params = ModularGrid.Utils.createParams(this.defaults, params);
		this.eventSender = new ModularGrid.Utils.EventSender();
	},

	setOpacity: function(value) {
		this.params.opacity = value;
		this.params.opacity = (this.params.opacity < 0 ? 0.0 : this.params.opacity);
		this.params.opacity = (this.params.opacity > 1 ? 1.0 : this.params.opacity);

		this.updateOpacity(this.params.opacity);

		return this.params.opacity;
	},

	stepDownOpacity: function() {
		return this.setOpacity(this.params.opacity - this.params.opacityStep);
	},

	stepUpOpacity: function() {
		return this.setOpacity(this.params.opacity + this.params.opacityStep);
	},

	updateOpacity: function(opacity) {
		this.eventSender.occurEvent('opacityChanged', this.params.opacity);
	},

	changeElementOpacity: function (element) {
		if (element)
			element.style.opacity = this.params.opacity;
	}
};/** @include "../index.js" */

ModularGrid.Image = {};/** @include "index.js" */

ModularGrid.Image.defaults = {
	/**
	 * Функция вызывается каждый раз при нажатии клавиш в браузере.
	 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
	 * @return {Boolean} true, если нужно показать/скрыть изображение
	 */
	shouldToggleVisibility:
		function (params) {
			// Ctrl + \
			var result = !params.occured_in_form && (params.ctrlKey && (params.character == '\\' || params.keyCode == 28 || params.keyCode == 220));
			return result;
		},

	/**
	 * Значения CSS-свойства z-index HTML-контейнера изображения
	 * @type Number
	 */
	'z-index': 255,

	/**
	 * Центрировать ли изображение относительно рабочей области браузера
	 * @type Boolean
	 */
	centered: false,

	/**
	 * Отступ от верхнего края рабочей области браузера до изображения в пикселах
	 * @type Number
	 */
	marginTop: 0,
	/**
	 * Отступ от левого края рабочей области браузера до изображения.
	 * Возможные значения аналогичны значениям CSS-свойства margin-left
	 * @type Number
	 */
	marginLeft: '0px',
	/**
	 * Отступ от правого края рабочей области браузера до изображения.
	 * Возможные значения аналогичны значениям CSS-свойства margin-left
	 * @type Number
	 */
	marginRight: '0px',

	/**
	 * URL файла изображения
	 * @type String
	 */
	src: '',

	/**
	 * Ширина изображения в пикселах
	 * @type Number
	 */
	width: 100,
	/**
	 * Высота изображения в пикселах
	 * @type Number
	 */
	height: 100
};/** @include "namespace.js" */
ModularGrid.Image = {

	showing: false,
	parentElement: null,

	params: null,

	imgElement: null,
	/** @type {ModularGrid.Utils.EventSender} */
	eventSender: null,

	/**
	 * Устанавливает настройки для гайдов
	 *
	 * @param {Object}
	 *            params параметры гайдов
	 */
	init: function(params) {
		this.params = ModularGrid.Utils.createParams(this.defaults, params);
		this.eventSender = new ModularGrid.Utils.EventSender();
	},

	/**
	 * Создает корневой HTML-элемент и HTML для гайдов и добавляет его в DOM
	 *
	 * @private
	 * @param {Object}
	 *            params параметры создания элемента и гайдов
	 * @return {Element} корневой HTML-элемент
	 */
	createParentElement: function(params) {
		// создаем элемент и ресетим style
		var parentElement = document.createElement("div");

		var parentElementStyle = {
			position : 'absolute',
			left : '0',
			top : '0',

			width : '100%',
			height : params.height + 'px',

			opacity: 1,
			'z-index' : params['z-index']
		};

		parentElement.setAttribute("style", ModularGrid.Utils.createStyleValue(parentElementStyle));

		// создаём HTML гайдов
		parentElement.appendChild(this.createImageDOM(params));

		// добавляем элемент в DOM
		ModularGrid.Utils.getDocumentBodyElement().appendChild(parentElement);

		return parentElement;
	},

	/**
	 * Создает HTML-строку для отображения гайдов
	 *
	 * @private
	 * @param {Array}
	 *            items массив настроек для создания гайдов
	 * @return {String} HTML-строка для отображения гайдов
	 */
	createImageDOM: function(params) {
		var imageStyle = {
			width : 'auto',
			height : 'auto',

			opacity : ModularGrid.OpacityChanger.params.opacity
		};
		var imageContainerStyle = {
			'padding-top' : params.marginTop + 'px',

			width : 'auto',
			height : 'auto'
		};

		if (params.centered) {
			imageContainerStyle['text-align'] = 'center';
			imageStyle.margin = '0 auto';
		} else {
			imageContainerStyle['padding-left'] = params.marginLeft, imageContainerStyle['padding-right'] = params.marginRight;
		};

		var imageDOMParent = document.createElement('div');
		imageDOMParent.setAttribute("style", ModularGrid.Utils.createStyleValue(imageContainerStyle));

		this.imgElement = document.createElement('img');
		this.imgElement.setAttribute('src', params.src);
		this.imgElement.setAttribute('width', params.width);
		this.imgElement.setAttribute('height', params.height);
		this.imgElement.setAttribute('style', ModularGrid.Utils.createStyleValue(imageStyle));

		imageDOMParent.appendChild(this.imgElement);

		return imageDOMParent;
	},

	opacityHandler: function () {
		ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Image.imgElement);
	},

	/**
	 * Скрывает-показывает гайды
	 */
	toggleVisibility: function() {
		this.showing = !this.showing;
		this.eventSender.occurEvent('visibilityChanged', this.showing);

		if (this.showing && this.parentElement == null) {
			this.parentElement = this.createParentElement(this.params);
		}

		if (this.parentElement)
			this.parentElement.style.display = (this.showing ? 'block' : 'none');
	}
};/** @include "../index.js" */
ModularGrid.Guides = {};/** @include "index.js */

ModularGrid.Guides.defaults = {
	/**
	 * Функция вызывается каждый раз при нажатии клавиш в браузере.
	 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
	 * @return {Boolean} true, если нужно показать/скрыть направляющие
	 */
	shouldToggleVisibility:
		function (params) {
			// Ctrl + ;
			var result = !params.occured_in_form && (params.ctrlKey && (params.character == ';' || params.keyCode == 186));
			return result;
		},

	/**
	 * Стиль линий-направляющих.
	 * Значения аналогичны значениям CSS-свойства border-style.
	 * @type String
	 */
	lineStyle: 'solid',
	/**
	 * Цвет линий-направляющих.
	 * Значения аналогичны значениям CSS-свойства border-color.
	 * @type String
	 */
	lineColor: '#9dffff',
	/**
	 * Толщина линий-направляющих.
	 * Значения аналогичны значениям CSS-свойства border-width.
	 * @type String
	 */
	lineWidth: '1px',

	/**
	 * значения CSS-свойства z-index HTML-контейнера всех направляющих
	 * @type Number
	 */
	'z-index': 255,

	/**
	 * Массив настроек направляющих.
	 * По-умолчанию направляющих нет.
	 * @type Array
	 */
	items: []
};/** @include "namespace.js" */

ModularGrid.Guides = {

	showing: false,
	parentElement: null,

	params: null,
	/** @type {ModularGrid.Utils.EventSender} */
	eventSender: null,

	/**
	 * Устанавливает настройки для гайдов
	 * @param {Object} params параметры гайдов
	 */
	init: function (params) {
		this.params = ModularGrid.Utils.createParams(this.defaults, params);
		this.eventSender = new ModularGrid.Utils.EventSender();
	},

	/**
	 * Создает корневой HTML-элемент и HTML для гайдов и добавляет его в DOM
	 * @private
	 * @param {Object} params параметры создания элемента и гайдов
	 * @return {Element} корневой HTML-элемент
	 */
	createParentElement: function (params) {
		// создаем элемент и ресетим style
		var parentElement = document.createElement("div");

		var parentElementStyleValue =
			ModularGrid.Utils.createStyleValue(
				{
					position: 'absolute',
					left: '0',
					top: '0',

					height: ModularGrid.Utils.getClientHeight() + 'px',
					width: '100%',

					'text-align': 'center',

					'z-index': params['z-index']
				}
			);
		parentElement.setAttribute("style", parentElementStyleValue);

		// создаём HTML гайдов
		parentElement.innerHTML = this.createGuidesHTML(params.items);

		// добавляем элемент в DOM
		ModularGrid.Utils.getDocumentBodyElement().appendChild(parentElement);

		return parentElement;
	},

	/**
	 * Создает HTML-строку для отображения гайдов
	 * @private
	 * @param {Array} items массив настроек для создания гайдов
	 * @return {String} HTML-строка для отображения гайдов
	 */
	createGuidesHTML: function (items) {
		var html = '';

		if ( items ) {
			var currentItem, styleParams, borderStyle = this.params.lineWidth + ' ' + this.params.lineStyle + ' ' + this.params.lineColor + ' !important';
			for(var i = items.length; i--;) {
				currentItem = items[i];
				styleParams = {
					position: 'absolute'
				};

				switch ( currentItem.type ) {
					case 'center':
						styleParams.width = '100%';
						styleParams.height = '100%';

						var innerStyleParams =
							{
								width: currentItem.width,
								height: '100%',

								margin: '0 auto',

								'border-left': borderStyle,
								'border-right': borderStyle
							};

						html += '<div style="' + ModularGrid.Utils.createStyleValue(styleParams) + '"><div style="' + ModularGrid.Utils.createStyleValue(innerStyleParams) + '"></div></div>';
					break;

					case 'vertical':
						styleParams.width = '0px';
						styleParams.height = '100%';

						if ( currentItem.left != null ) {
							styleParams.left = currentItem.left;
							styleParams['border-right'] = borderStyle;
						}

						if ( currentItem.right != null ) {
							styleParams.right = currentItem.right;
							styleParams['border-left'] = borderStyle;
						}

						html += '<div style="' + ModularGrid.Utils.createStyleValue(styleParams) + '"></div>';
					break;

					case 'horizontal':
						styleParams.width = '100%';
						styleParams.height = '0px';

						if ( currentItem.top != null ) {
							styleParams.top = currentItem.top;
							styleParams['border-bottom'] = borderStyle;
						}

						if ( currentItem.bottom != null ) {
							styleParams.bottom = currentItem.bottom;
							styleParams['border-top'] = borderStyle;
						}

						html += '<div style="' + ModularGrid.Utils.createStyleValue(styleParams) + '"></div>';
					break;
				}

			};
		}

		return html;
	},

	/**
	 * Скрывает-показывает гайды
	 */
	toggleVisibility: function () {
		this.showing = !this.showing;
		this.eventSender.occurEvent('visibilityChanged', this.showing);

		if ( this.showing && this.parentElement == null ) {
			this.parentElement = this.createParentElement(this.params);
		}

		if ( this.parentElement )
			this.parentElement.style.display = ( this.showing ? 'block' : 'none' );
	}

};/** @include "../index.js" */
ModularGrid.Grid = {};/** @include "index.js */

/**
 * Настройки для модульной сетки по-умолчанию
 * @type Object
 */
ModularGrid.Grid.defaults = {
	shouldToggleVerticalGridVisibility:
		function (params) {
			// Shift + v
			// показать/скрыть вертикальные элементы сетки (колонки)
			var result = !params.occured_in_form && (params.shiftKey && params.character == 'v' );
			return result;
		},

	shouldToggleHorizontalGridVisibility:
		function (params) {
			// Shift + h
			// показать/скрыть горизонтальные элементы сетки (строки)
			var result = !params.occured_in_form && (params.shiftKey && params.character == 'h' );
			return result;
		},

	shouldToggleFontGridVisibility:
		function (params) {
			// Shift + f
			// показать/скрыть шрифтовую сетку
			var result = !params.occured_in_form && (params.shiftKey && params.character == 'f' );
			return result;
		},

	shouldToggleVisibility:
		function (params) {
			// Ctrl + '
			// показать/скрыть всю сетку
			// скрывает если хотя бы один из элементов сетки показан (шрифтовая, колонки или строки)
			var result = !params.occured_in_form && (params.ctrlKey && (params.character == "'" || params.keyCode == 222));
			return result;
		},

	'z-index': 255,

	/**
	 * Цвет фона колонок и строк модульной сетки.
	 * Цвет линий шрифтовой сетки задаётся отдельно.
	 * @see lineColor
	 * @type String
	 */
	color: "#F00",

	/**
	 * Центрировать ли сетку
	 * @type Boolean
	 */
	centered: true,

	prependGutter: false,
	appendGutter: false,

	gutter: 16,

	/**
	 * Ширина столбца модульной сетки в строках модульной сетки
	 * @see lineHeight
	 * @type Number
	 */
	vDivisions: 6,

	/**
	 * Высота строки модульной сетки в строках модульной сетки.
	 * @see lineHeight
	 * @type Number
	 */
	hDivisions: 4,

	/**
	 * Отступ от верхнего края рабочей области браузера до сетки в пикселах.
	 * @type Number
	 */
	marginTop: 0,
	/**
	 * Отступ от левого края рабочей области браузера до сетки.
	 * Значения аналогичны значениям CSS-свойства margin-left
	 * @type Number
	 */
	marginLeft: '18px',
	/**
	 * Отступ от правого края рабочей области браузера до сетки.
	 * Значения аналогичны значениям CSS-свойства margin-right
	 * @type Number
	 */
	marginRight: '18px',

	width: 464,
	minWidth: 464,
	maxWidth: null,

	/**
	 * Высота строки в пикселах.
	 * Используется для рисования шрифтовой сетки.
	 * Сама линия сетки начинает рисоваться на (lineHeight + 1) пикселе
	 * @type Number
	 */
	lineHeight: 16,

	// стиль линий шрифтовой сетки
	/**
	 * Стиль линий шрифтовой сетки.
	 * Значения аналогичны значениям CSS-свойства border-style
	 * @type String
	 */
	lineStyle: 'solid',
	/**
	 * Толщина линий шрифтовой сетки.
	 * Значения аналогичны значениям CSS-свойства border-width
	 * @type String
	 */
	lineWidth: '1px',
	/**
	 * Цвет линий шрифтовой сетки.
	 * Значения аналогичны значениям CSS-свойства border-color
	 * @type String
	 */
	lineColor: "#555"
};/** @include "namespace.js" */

ModularGrid.Grid = {

	/**
	 * Показывается ли хотя бы один из элементов модульной сетки (шрифтовая сетка, столбцы или строки)
	 * @type Boolean
	 */
	showing: false,

	fontGridShowing: false,
	fontGridParentElement: null,

	horizontalGridShowing: false,
	horizontalGridParentElement: null,

	verticalGridShowing: false,
	verticalGridParentElement: null,

	/**
	 * Параметры модульной сетки (значения по-умолчанию + пользваотельские настройки)
	 * @type Object
	 */
	params: null,

	/** @type {ModularGrid.Utils.EventSender} */
	eventSender: null,

	/**
	 * Устанавливает настройки для гайдов
	 * @param {Object} params параметры гайдов
	 */
	init: function (params) {
		this.params = ModularGrid.Utils.createParams(this.defaults, params);
		this.eventSender = new ModularGrid.Utils.EventSender();
	},

	/**
	 * Создает элементы-родители для элементов модульной сетки
	 * в порядке столбцы, строки, шрифтовая сетка и добавляет их в DOM
	 * @private
	 * @param {Object} params параметры создания элемента и гайдов
	 * @return {Element} корневой HTML-элемент модульной сетки
	 */
	createParentElement: function (params) {
		var parentElement = ModularGrid.Utils.getDocumentBodyElement();

		parentElement.appendChild( this.createVerticalGridParentElement(params) );
		parentElement.appendChild( this.createHorizontalGridParentElement(params) );
		parentElement.appendChild( this.createFontGridParentElement(params) );

		return parentElement;
	},

	opacityHandler: function () {
		ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Grid.fontGridParentElement);
		ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Grid.verticalGridParentElement);
		ModularGrid.OpacityChanger.changeElementOpacity(ModularGrid.Grid.horizontalGridParentElement);
	},

	createVerticalGridParentElement: function (params) {
		this.verticalGridParentElement = document.createElement('div');
		this.verticalGridParentElement.setAttribute(
			"style",
			ModularGrid.Utils.createStyleValue(
				{
					position: 'absolute',
					left: '0',
					top: '0',

					display: 'none',

					height: ModularGrid.Utils.getClientHeight() + 'px',
					width: '100%',

					opacity: ModularGrid.OpacityChanger.params.opacity,
					'z-index': params['z-index']
				}
			)
		);

		this.updateVerticalGridContents();

		return this.verticalGridParentElement;
	},

	updateVerticalGridContents: function () {
		html = ModularGrid.Grid.createVerticalGridHTML(ModularGrid.Grid.params);
		ModularGrid.Grid.verticalGridParentElement.innerHTML = html;
	},

	/**
	 * @private
	 * @return {String} HTML для отображения вертикальной модульной сетки
	 */
	createVerticalGridHTML: function (params) {
		var html = '';

		var fluid = ( typeof(params.width) == "string" && params.width.substr(params.width.length - 1) == "%" );
		var width = (fluid ? params.minWidth : params.width);

		// создаём вертикальную сетку
		var gutterCount = params.vDivisions - 1;
		( params.prependGutter ? gutterCount++ : null );
		( params.appendGutter ? gutterCount++ : null );

		var gutterPercent = (params.gutter / width) * 100;
		var divisionPercent = (100 - gutterCount * gutterPercent) / params.vDivisions;

		var x = (params.prependGutter ? gutterPercent : 0);

		var styleCSS =
			{
				position: 'relative',

				'float': 'left',

				'margin-right': '-' + divisionPercent + '%',

				width: divisionPercent + '%',
				height: ModularGrid.Utils.getClientHeight() + 'px',

				background: params.color,

				opacity: params.opacity
			};
		for(var i = params.vDivisions; i--;) {
			styleCSS.left = x + '%';
			html += '<div style="' + ModularGrid.Utils.createStyleValue(styleCSS) + '"></div>';

			x += gutterPercent + divisionPercent;
		};

		// создаём контейнер колонок (центрирование, фиксация ширины и т.п.)
		var widthContainerStyle =
			{
				width: ( fluid ? params.width : width + 'px' )
			};

		if ( fluid ) {
			if ( params.maxWidth )
				widthContainerStyle['max-width'] = params.maxWidth + 'px';

			if ( params.minWidth )
				widthContainerStyle['min-width'] = params.minWidth + 'px';
			else
				alert('Ошибка: не задан параметр minWidth\nСетка может отображаться некорректно\n\nЧтобы сетка отображалась корректно, задайте параметр minWidth')
		}

		if ( params.centered ) {
			var centeredContainerStyle =
				{
					'text-align': 'center'
				};
			widthContainerStyle.margin = '0 auto';

			html = '<div style="' + ModularGrid.Utils.createStyleValue(centeredContainerStyle) + '"><div style="' + ModularGrid.Utils.createStyleValue(widthContainerStyle) + '">' + html + '</div></div>';
		}
		else
			html = '<div style="' + ModularGrid.Utils.createStyleValue(widthContainerStyle) + '">' + html + '</div>';

		var marginContainerStyle =
			{
				width: 'auto',

				padding: '0 ' + params.marginRight + ' 0 ' + params.marginLeft
			};
		html = '<div style="' + ModularGrid.Utils.createStyleValue(marginContainerStyle) + '">' + html + '</div>';

		return html;
	},

	createHorizontalGridParentElement: function (params) {
		this.horizontalGridParentElement = document.createElement('div');
		// ресетим style
		var parentElementStyleValue =
			ModularGrid.Utils.createStyleValue(
				{
					position: 'absolute',
					left: '0',
					top: '0',

					display: 'none',

					height: ModularGrid.Utils.getClientHeight() + 'px',
					width: '100%',

					opacity: ModularGrid.OpacityChanger.params.opacity,
					'z-index': params['z-index']
				}
			);
		this.horizontalGridParentElement.setAttribute("style", parentElementStyleValue);

		this.updateHorizontalGridContents();

		return this.horizontalGridParentElement;
	},

	updateHorizontalGridContents: function () {
		html = ModularGrid.Grid.createHorizontalGridHTML(ModularGrid.Grid.params);
		ModularGrid.Grid.horizontalGridParentElement.innerHTML = html;
	},

	/**
	 * @private
	 * @return {String} HTML для отображения горизонтальной модульной сетки
	 */
	createHorizontalGridHTML: function (params) {
		var horizontalGridHTML = '';

		var height = ModularGrid.Utils.getClientHeight();
		var y = params.marginTop;

		var hCounter = 0;
		var hCounterMax = params.hDivisions + 1;
		var hHeight = params.lineHeight * params.hDivisions;

		var styleCSS =
			{
				position: 'absolute',

				width: 'auto',

				left: params.marginLeft,
				right: params.marginRight,

				height: hHeight + 'px',

				background: params.color,
				opacity: params.opacity
			};

		while ( y < height ) {
			if ( hCounter == 0 && (y + hHeight) < height ) {
				styleCSS.top = y + 'px';
				horizontalGridHTML += '<div style="' + ModularGrid.Utils.createStyleValue(styleCSS) + '"></div>';
			}

			y += params.lineHeight;

			hCounter++;
			if ( hCounter == hCounterMax )
				hCounter = 0;
		}

		return horizontalGridHTML;
	},

	createFontGridParentElement: function (params) {
		this.fontGridParentElement = document.createElement('div');
		// ресетим style
		var parentElementStyleValue =
			ModularGrid.Utils.createStyleValue(
				{
					position: 'absolute',
					left: '0',
					top: '0',

					display: 'none',

					height: ModularGrid.Utils.getClientHeight() + 'px',
					width: '100%',

					opacity: ModularGrid.OpacityChanger.params.opacity,
					'z-index': params['z-index']
				}
			);
		this.fontGridParentElement.setAttribute("style", parentElementStyleValue);

		this.updateFontGridContents();

		return this.fontGridParentElement;
	},

	updateFontGridContents: function () {
		html = ModularGrid.Grid.createFontGridHTML(ModularGrid.Grid.params);
		ModularGrid.Grid.fontGridParentElement.innerHTML = html;
	},

	/**
	 * @private
	 * @return {String} HTML для отображения шрифтовой сетки
	 */
	createFontGridHTML: function (params) {
		var fontGridHTML = "";

		var height = ModularGrid.Utils.getClientHeight();
		var y = params.marginTop + params.lineHeight;

		var styleCSS =
			{
				position: 'absolute',
				height: 0,

				opacity: params.opacity,

				'border-bottom': params.lineWidth + ' ' + params.lineStyle + ' ' + params.lineColor + ' !important'
			};

		while ( y < height ) {
			styleCSS.top = (y + 'px');
			fontGridHTML += '<div style="' + ModularGrid.Utils.createStyleValue(styleCSS) + '"></div>';

			y += params.lineHeight;
		};

		return fontGridHTML;
	},

	/**
	 * Скрывает-показывает гайды
	 */
	toggleVisibility: function () {
		this.showing = !this.showing;

		this.fontGridShowing = this.showing;
		this.eventSender.occurEvent('fontVisibilityChanged', this.fontGridShowing);

		this.horizontalGridShowing = this.showing;
		this.eventSender.occurEvent('horizontalVisibilityChanged', this.horizontalGridShowing);

		this.verticalGridShowing = this.showing;
		this.eventSender.occurEvent('verticalVisibilityChanged', this.verticalGridShowing);

		this.eventSender.occurEvent('visibilityChanged', this.showing);

		this.updateFontGridVisibility();
		this.updateHorizontalGridVisibility();
		this.updateVerticalGridVisibility();
	},

	updateFontGridVisibility: function () {
		if ( this.fontGridShowing && this.fontGridParentElement == null )
			this.createParentElement(this.params);

		if ( this.fontGridParentElement )
			this.fontGridParentElement.style.display = ( this.fontGridShowing ? 'block' : 'none' );
	},

	updateHorizontalGridVisibility: function () {
		if ( this.horizontalGridShowing && this.horizontalGridParentElement == null )
			this.createParentElement(this.params);

		if ( this.horizontalGridParentElement )
			this.horizontalGridParentElement.style.display = ( this.horizontalGridShowing ? 'block' : 'none' );
	},

	updateVerticalGridVisibility: function () {
		if ( this.verticalGridShowing && this.verticalGridParentElement == null )
			this.createParentElement(this.params);

		if ( this.verticalGridParentElement )
			this.verticalGridParentElement.style.display = ( this.verticalGridShowing ? 'block' : 'none' );
	},

	toggleHorizontalGridVisibility: function (do_not_send_events) {
		this.horizontalGridShowing = !this.horizontalGridShowing;
		if ( !do_not_send_events )
			this.eventSender.occurEvent('horizontalVisibilityChanged', this.horizontalGridShowing);

		this.updateShowing(do_not_send_events);

		this.updateHorizontalGridVisibility();
	},

	toggleVerticalGridVisibility: function (do_not_send_events) {
		this.verticalGridShowing = !this.verticalGridShowing;
		if ( !do_not_send_events )
			this.eventSender.occurEvent('verticalVisibilityChanged', this.verticalGridShowing);

		this.updateShowing(do_not_send_events);

		this.updateVerticalGridVisibility();
	},

	toggleFontGridVisibility: function (do_not_send_events) {
		this.fontGridShowing = !this.fontGridShowing;
		if ( !do_not_send_events )
			this.eventSender.occurEvent('fontVisibilityChanged', this.fontGridShowing);

		this.updateShowing(do_not_send_events);

		this.updateFontGridVisibility();
	},

	updateShowing: function (do_not_send_events) {
		this.showing = this.fontGridShowing || this.horizontalGridShowing || this.verticalGridShowing;

		if ( !do_not_send_events )
			this.eventSender.occurEvent('visibilityChanged', this.showing);
	}

};/** @include "../index.js" */
ModularGrid.Resizer = {};/** @include "index.js */

ModularGrid.Resizer.defaults = {
	/**
	 * Функция вызывается каждый раз при нажатии клавиш в браузере.
	 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
	 * @return {Boolean} true, если нужно изменить размер на следующий из заданных
	 */
	shouldToggleSize:
		function (params) {
			// Shift + r
			var result = !params.occured_in_form && (params.shiftKey && params.character == 'r');
			return result;
		},

	/**
	 * Нужно ли в title окна указывать разрешение
	 * @type Boolean
	 */
	changeTitle: true,

	/**
	 * Размеры по-умолчанию не заданы
	 * @type Array
	 */
	sizes: []
};/** @include "namespace.js" */
ModularGrid.Resizer = {

	params: null,

	sizes: null,
	currentSizeIndex: null,

	title: null,

	/** @type {ModularGrid.Utils.EventSender} */
	eventSender: null,

	detectDefaultSize: function () {
		var result = null;

		if ( typeof( window.innerWidth ) == 'number' && typeof( window.innerHeight ) == 'number' ) {
			result =
 				{
					width: window.innerWidth,
					height: window.innerHeight
				};
		}
		else
			if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
				result =
					{
						width: document.documentElement.clientWidth,
						height: document.documentElement.clientHeight
					};
			}
			else
				if ( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
					result =
						{
							width: document.body.clientWidth,
							height: document.body.clientHeight
						};
				}

		return result;
	},

	getDefaultSize: function () {
		return this.sizes[0];
	},

	getCurrentSize: function () {
		return this.sizes[this.currentSizeIndex];
	},

	/**
	 * Устанавливает настройки для гайдов
	 * @param {Object} params параметры гайдов
	 */
	init: function (params, grid) {
		this.params = ModularGrid.Utils.createParams(this.defaults, params);
		this.eventSender = new ModularGrid.Utils.EventSender();

		var defaultSize = this.detectDefaultSize();
		if ( defaultSize ) {
			var sizes = [ defaultSize ], target_sizes = this.params.sizes;

			if ( target_sizes.length ) {
				for(var i = 0, length = target_sizes.length; i < length; i++)
					sizes[sizes.length] = target_sizes[i];
			}
			else {
				if ( grid.params.minWidth )
					sizes[sizes.length] = {	width: grid.params.minWidth	};
			}

			if ( sizes.length > 1 ) {
				if ( this.params.changeTitle )
					this.title = document.title;

				this.sizes = sizes;
				this.currentSizeIndex = 0;
			}
		}
	},

	sizeTitle: function(index) {
		var result, current_size = this.sizes[index], default_size = this.sizes[0];
		if ( current_size.title ) {
			result = current_size.title;
		}
		else {
			var width = ( current_size.width ? current_size.width : default_size.width );
			var height = ( current_size.height ? current_size.height : default_size.height );

			result = width + '×' + height;
		}

		return result;
	},

	selectSize: function(index) {
		this.currentSizeIndex = index;

		this.applySize();
	},

	toggleSize: function () {
		if ( this.currentSizeIndex != null ) {
			this.currentSizeIndex++;
			this.currentSizeIndex = ( this.currentSizeIndex == this.sizes.length ? 0 : this.currentSizeIndex );

			this.applySize();
		}
	},

	applySize: function () {
		var width = ( this.getCurrentSize().width ? this.getCurrentSize().width : this.getDefaultSize().width );
		var height = ( this.getCurrentSize().height ? this.getCurrentSize().height : this.getDefaultSize().height );

		window.resizeTo(width, height);

		if ( this.params.changeTitle ) {
			var titleText = ( this.currentSizeIndex ? this.title + ' (' + width + '×' + height + ')' : this.title );
			if ( this.getCurrentSize().title )
				titleText = this.getCurrentSize().title;

			document.title = titleText;
		}

		this.eventSender.occurEvent('sizeChanged', this.currentSizeIndex);
	}

};/**
 * @include "../index.js"
 * @include "defaults.js"
 */

ModularGrid.GUI = {

	params: null,

	togglerElement: null,

	paneElement: null,
	paneShowing: true,

	checkboxes: {},

	init: function(params) {
		this.params = ModularGrid.Utils.createParams(this.defaults, params);
	},

	create: function() {
		this.createToggler();
		this.createPane();
	},

	createToggler: function() {
		var self = this;

		self.togglerElement = document.createElement("button");
		self.togglerElement.innerHTML = self.params.toggler.label;

		var styleValue = ModularGrid.Utils.createStyleValue(self.params.toggler.style, {});
		self.togglerElement.setAttribute("style", styleValue);

		// добавляем элемент в DOM
		ModularGrid.Utils.getDocumentBodyElement().appendChild(self.togglerElement);


		self.togglerElement.onclick = function () {
			self.paneShowing = !self.paneShowing;

			self.paneElement.style.display = (self.paneShowing ? 'block' : 'none');
		}
	},

	createPaneCheckboxItemHTML: function (id, label, style) {
		var currentStyle = style || '';

		var html = '<div style="width:auto;' + currentStyle + '">';
		html += '<input type="checkbox" id="' + id + '">';
		html += '<label for="' + id + '">&nbsp;' + label + '</label>';
		html += '</div>';

		return html;
	},

	createPane: function() {
		var self = this;
		self.paneElement = document.createElement("div");

		var currentStyle = self.params.pane.style;
		var styleValue = ModularGrid.Utils.createStyleValue(currentStyle, {});
		self.paneElement.setAttribute("style", styleValue);

		var ids = {}, html = '';

		ids.guides = self.generateId() + 'guides';
		html += self.createPaneCheckboxItemHTML(ids.guides, self.params.pane.labels.guides);


		ids.grid = self.generateId() + 'grid';
		html += self.createPaneCheckboxItemHTML(ids.grid, self.params.pane.labels.grid.all, 'margin:1em 0 0');

		ids.font_grid = self.generateId() + 'fontgrid';
		html += self.createPaneCheckboxItemHTML(ids.font_grid, self.params.pane.labels.grid.font, 'padding:0 0 0 1em');

		ids.vertical_grid = self.generateId() + 'verticalgrid';
		html += self.createPaneCheckboxItemHTML(ids.vertical_grid, self.params.pane.labels.grid.vertical, 'padding:0 0 0 1em');

		ids.horizontal_grid = self.generateId() + 'horizontalgrid';
		html += self.createPaneCheckboxItemHTML(ids.horizontal_grid, self.params.pane.labels.grid.horizontal, 'padding:0 0 1em 1em');


		ids.image = self.generateId() + 'image';
		html += self.createPaneCheckboxItemHTML(ids.image, self.params.pane.labels.image, 'margin:0 0 1em');


		if ( ModularGrid.Resizer.sizes.length ) {
			html += '<div style="width:auto">';
			ids.sizes = self.generateId() + 'sizes';
			html += '<select size="1" id="' + ids.sizes + '"><option>' + this.params.pane.labels.size + '</option></select>';
			html += '</div>';
		}

		html += '<div style="width:auto;margin:1em 0 0">';
		ids.opacity_down = self.generateId() + 'opacitydown';
		ids.opacity_up = self.generateId() + 'opacityup';
		ids.opacity_value = self.generateId() + 'opacityvalue';
		if ( self.params.pane.labels.opacity )
			html += self.params.pane.labels.opacity + '<br>';
		html += '<button id="' + ids.opacity_down + '">-</button>&nbsp;';
		html += '<span id="' + ids.opacity_value +'">' + ModularGrid.OpacityChanger.params.opacity.toFixed(2) + '</span>';
		html += '&nbsp;<button id="' + ids.opacity_up + '">+</button>';
		html += '</div>';

		self.paneElement.innerHTML = html;

		// добавляем элемент в DOM
		ModularGrid.Utils.getDocumentBodyElement().appendChild(this.paneElement);

		self.checkboxes.guides = document.getElementById(ids.guides);
		if ( self.checkboxes.guides ) {
			self.checkboxes.guides.onclick = function () {
				ModularGrid.Guides.toggleVisibility();
			};
			ModularGrid.Guides.eventSender.addHandler(
				'visibilityChanged',
				function(visible) {
					self.checkboxes.guides.checked = visible;
				}
			);
		}

		self.checkboxes.grid = document.getElementById(ids.grid);
		if ( self.checkboxes.grid ) {
			self.checkboxes.grid.onclick = function () {
				ModularGrid.Grid.toggleVisibility();
			};
			ModularGrid.Grid.eventSender.addHandler(
				'visibilityChanged',
				function(visible) {
					self.checkboxes.grid.checked = visible;
				}
			);
		}

		self.checkboxes.font_grid = document.getElementById(ids.font_grid);
		if ( self.checkboxes.font_grid ) {
			self.checkboxes.font_grid.onclick = function () {
				ModularGrid.Grid.toggleFontGridVisibility();
			};
			ModularGrid.Grid.eventSender.addHandler(
				'fontVisibilityChanged',
				function(visible) {
					self.checkboxes.font_grid.checked = visible;
				}
			);
		}

		self.checkboxes.vertical_grid = document.getElementById(ids.vertical_grid);
		if ( self.checkboxes.vertical_grid ) {
			self.checkboxes.vertical_grid.onclick = function () {
				ModularGrid.Grid.toggleVerticalGridVisibility();
			};
			ModularGrid.Grid.eventSender.addHandler(
				'verticalVisibilityChanged',
				function(visible) {
					self.checkboxes.vertical_grid.checked = visible;
				}
			);
		}

		self.checkboxes.horizontal_grid = document.getElementById(ids.horizontal_grid);
		if ( self.checkboxes.horizontal_grid ) {
			self.checkboxes.horizontal_grid.onclick = function () {
				ModularGrid.Grid.toggleHorizontalGridVisibility();
			};
			ModularGrid.Grid.eventSender.addHandler(
				'horizontalVisibilityChanged',
				function(visible) {
					self.checkboxes.horizontal_grid.checked = visible;
				}
			);
		}

		self.checkboxes.image = document.getElementById(ids.image);
		if ( self.checkboxes.image ) {
			self.checkboxes.image.onclick = function () {
				ModularGrid.Image.toggleVisibility();
			};
			ModularGrid.Image.eventSender.addHandler(
				'visibilityChanged',
				function(visible) {
					self.checkboxes.image.checked = visible;
				}
			);
		}

		self.checkboxes.sizes = document.getElementById(ids.sizes);
		if ( self.checkboxes.sizes ) {
			var current_html = '';
			for(var i = 0, length = ModularGrid.Resizer.sizes.length; i < length; i++) {
				current_html += '<option>' + ModularGrid.Resizer.sizeTitle(i) + '</option>';
			}
			self.checkboxes.sizes.innerHTML += current_html;

			self.checkboxes.sizes.onchange = function () {
				ModularGrid.Resizer.selectSize(self.checkboxes.sizes.selectedIndex - 1);
			};

			ModularGrid.Resizer.eventSender.addHandler(
				'sizeChanged',
				function(index) {
					self.checkboxes.sizes.selectedIndex = index + 1;
				}
			);
		}

		self.checkboxes.opacity_value = document.getElementById(ids.opacity_value);
		if ( self.checkboxes.opacity_value ) {
			ModularGrid.OpacityChanger.eventSender.addHandler(
				'opacityChanged',
				function(opacity) {
					self.checkboxes.opacity_value.innerHTML = opacity.toFixed(2);
				}
			);
		}

		self.checkboxes.opacity_up = document.getElementById(ids.opacity_up);
		if ( self.checkboxes.opacity_up ) {
			self.checkboxes.opacity_up.onclick = function () {
				ModularGrid.OpacityChanger.stepUpOpacity();
			}
		}

		self.checkboxes.opacity_down = document.getElementById(ids.opacity_down);
		if ( self.checkboxes.opacity_down ) {
			self.checkboxes.opacity_down.onclick = function () {
				ModularGrid.OpacityChanger.stepDownOpacity();
			}
		}
	},

	/**
	 * @private
	 * @return {String} уникальный идентификатор
	 */
	generateId: function() {
		var prefix = '_mdg', result = new Date();
		result = prefix + result.getTime();

		return result;
	}

}/** @include "index.js */

ModularGrid.GUI.defaults = {

	toggler: {
		style: {
			position: "absolute",
			right: '10px',
			top: '10px',
			'z-index': 1000
		},

		label: "Настройки сетки"
	},

	pane: {
		style: {
			position: "absolute",
			right: '10px',
			top: '35px',

			width: 'auto',
			height: 'auto',

			margin: '0',
			padding: '7px 5px',

			background: '#FFF',
			border: '2px solid #CCC',

			'z-index': 1000
		},

		labels: {
			guides: 'гайды <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + ;</span>',
			size: 'выберите размер (Shift + r)',
			grid: {
				all: 'сетка <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \'</span>',
				font: 'шрифтовая <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + f</span>',
				vertical: 'вертикальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + v</span>',
				horizontal: 'горизонтальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + h</span>'
			},
			image: 'изображение-макет <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \\</span>',
			opacity: 'прозрачность'
		}
	}

};/**
 * @include "namespace.js"
 * @include "Utils/index.js"
 * @include "Grid/index.js"
 * @include "Guides/index.js"
 * @include "Resizer/index.js"
 * @include "OpacityChanger/index.js"
 * @include "GUI/index.js"
 */

ModularGrid.keyDownEventProvider = null;
ModularGrid.resizeEventProvider = null;

/**
 * Возвращает обертку для отлова события изменения размера окна браузера
 * @private
 * @return {ModularGrid.Utils.EventProvider} для события изменения размера окна браузера
 */
ModularGrid.getResizeEventProvider = function () {
	if ( this.resizeEventProvider == null ) {
		this.resizeEventProvider =
			new ModularGrid.Utils.EventProvider(
				'resize',
				function (event) {
					return {
						event: event
					};
				},
				'window'
			);
	};

	return this.resizeEventProvider;
};

/**
 * Возвращает обертку для отлова события нажатия клавиш
 * @private
 * @return {ModularGrid.Utils.EventProvider} для события нажатия клавиш
 */
ModularGrid.getKeyDownEventProvider = function () {
	if ( this.keyDownEventProvider == null ) {
		this.keyDownEventProvider =
			new ModularGrid.Utils.EventProvider(
				'keydown',
				function (event) {
					var keyboardEvent = ( event || window.event );
					var keyCode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : (keyboardEvent.which ? keyboardEvent.which : keyboardEvent.keyChar));

					var character = String.fromCharCode(keyCode).toLowerCase();
					var shift_nums = {
						"`":"~",
						"1":"!",
						"2":"@",
						"3":"#",
						"4":"$",
						"5":"%",
						"6":"^",
						"7":"&",
						"8":"*",
						"9":"(",
						"0":")",
						"-":"_",
						"=":"+",
						";":":",
						"'":"\"",
						",":"<",
						".":">",
						"/":"?",
						"\\":"|"
					}
					if ( keyboardEvent.shiftKey && shift_nums[character] )
						character = shift_nums[character];

				var element = ( keyboardEvent.target ? keyboardEvent.target : keyboardEvent.srcElement );
				if ( element && element.nodeType == 3 )
					element = element.parentNode;
				var occured_in_form = ( element && (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA'));

					return {
						occured_in_form: occured_in_form,
						character: character,
						keyCode: keyCode,

						altKey: keyboardEvent.altKey,
						shiftKey: keyboardEvent.shiftKey,
						ctrlKey: keyboardEvent.ctrlKey,

						event: keyboardEvent
					};
				}
			);
	};

	return this.keyDownEventProvider;
};

/**
 * Устанавливает настройки модульной сетки и ставит обработчики событий для показа сетки
 * @param {Object} params параметры инициализации
 */
ModularGrid.init = function (params) {
	var self = this;
	var store = ModularGrid.Utils.CookieStore;

	this.OpacityChanger.init(params.opacity);
	var opacityUpChanger =
		new ModularGrid.Utils.StateChanger(
			this.getKeyDownEventProvider(),
			this.OpacityChanger.params.shouldStepUpOpacity,
			function () {
				self.OpacityChanger.stepUpOpacity();
			}
		);
	var opacityDownChanger =
		new ModularGrid.Utils.StateChanger(
			this.getKeyDownEventProvider(),
			this.OpacityChanger.params.shouldStepDownOpacity,
			function () {
				self.OpacityChanger.stepDownOpacity();
			}
		);
	this.OpacityChanger.eventSender.addHandler(
		'opacityChanged',
		function(opacity) {
			store.setValue('o', opacity);
		}
	);

	// изображение
	this.Image.init(params.image);
	this.OpacityChanger.eventSender.addHandler('opacityChanged', this.Image.opacityHandler);
	var imageStateChanger =
		new ModularGrid.Utils.StateChanger(
			this.getKeyDownEventProvider(),
			this.Image.params.shouldToggleVisibility,
			function () {
				self.Image.toggleVisibility();
//				store.setValue('i', self.Image.showing);
			}
		);

	// гайды
	self.Guides.init(params.guides);
	var guidesStateChanger =
		new ModularGrid.Utils.StateChanger(
			self.getKeyDownEventProvider(),
			self.Guides.params.shouldToggleVisibility,
			function () {
				self.Guides.toggleVisibility();
			}
		);
	self.Guides.eventSender.addHandler(
		'visibilityChanged',
		function(visible) {
			store.setValue('g', visible);
		}
	);

	// сетка
	this.Grid.init(params.grid);
	this.OpacityChanger.eventSender.addHandler('opacityChanged', this.Grid.opacityHandler);
	var gridStateChanger =
		new ModularGrid.Utils.StateChanger(
			this.getKeyDownEventProvider(),
			this.Grid.params.shouldToggleVisibility,
			function () {
				self.Grid.toggleVisibility();
			}
		);
	self.Grid.eventSender.addHandler(
		'visibilityChanged',
		function(visible) {
			store.setValue('v', self.Grid.verticalGridShowing);
			store.setValue('h', self.Grid.horizontalGridShowing);
			store.setValue('f', self.Grid.fontGridShowing);
		}
	);


	var gridFontGridVisibilityChanger =
		new ModularGrid.Utils.StateChanger(
			this.getKeyDownEventProvider(),
			this.Grid.params.shouldToggleFontGridVisibility,
			function () {
				self.Grid.toggleFontGridVisibility();
			}
		);
	self.Grid.eventSender.addHandler(
		'fontVisibilityChanged',
		function(visible) {
			store.setValue('f', self.Grid.fontGridShowing);
		}
	);


	var gridHorizontalGridVisibilityChanger =
		new ModularGrid.Utils.StateChanger(
			this.getKeyDownEventProvider(),
			this.Grid.params.shouldToggleHorizontalGridVisibility,
			function () {
				self.Grid.toggleHorizontalGridVisibility();
			}
		);
	self.Grid.eventSender.addHandler(
		'horizontalVisibilityChanged',
		function(visible) {
			store.setValue('h', self.Grid.horizontalGridShowing);
		}
	);


	var gridVerticalGridVisibilityChanger =
		new ModularGrid.Utils.StateChanger(
			this.getKeyDownEventProvider(),
			this.Grid.params.shouldToggleVerticalGridVisibility,
			function () {
				self.Grid.toggleVerticalGridVisibility();
			}
		);
	self.Grid.eventSender.addHandler(
		'verticalVisibilityChanged',
		function(visible) {
			store.setValue('v', self.Grid.verticalGridShowing);
		}
	);


	// resizer
	self.Resizer.init(params.resizer, self.Grid);
	var resizerSizeChanger =
		new ModularGrid.Utils.StateChanger(
			self.getKeyDownEventProvider(),
			self.Resizer.params.shouldToggleSize,
			function () {
				self.Resizer.toggleSize();
			}
		);


	// change dimensions by window resize
	ModularGrid.getResizeEventProvider().addHandler(
		function (params) {
			var heightStyleValue = ModularGrid.Utils.getClientHeight() + 'px';

			ModularGrid.Utils.updateCSSHeight(ModularGrid.Grid.horizontalGridParentElement, heightStyleValue, ModularGrid.Grid.updateHorizontalGridContents);
			ModularGrid.Utils.updateCSSHeight(ModularGrid.Grid.fontGridParentElement, heightStyleValue, ModularGrid.Grid.updateFontGridContents);
			ModularGrid.Utils.updateCSSHeight(ModularGrid.Grid.verticalGridParentElement, heightStyleValue, ModularGrid.Grid.updateVerticalGridContents);

			ModularGrid.Utils.updateCSSHeight(ModularGrid.Guides.parentElement, heightStyleValue);
		}
	);

	self.GUI.init(params.gui);
	self.GUI.create();

	// восстанавливаем состояния из кук
	// по-умолчанию: всё скрыто
	if ( store.getValue('i') == 'true' )
		self.Image.toggleVisibility();

	var image_opacity = parseFloat(store.getValue('o'));
	if ( !isNaN(image_opacity) ) {
		self.OpacityChanger.setOpacity( image_opacity );
	}

	if ( store.getValue('g') == 'true' )
		self.Guides.toggleVisibility();

	if ( store.getValue('v') == 'true' )
		self.Grid.toggleVerticalGridVisibility(true);

	if ( store.getValue('h') == 'true' )
		self.Grid.toggleHorizontalGridVisibility(true);

	if ( store.getValue('f') == 'true' )
		self.Grid.toggleFontGridVisibility(true);

	self.Grid.updateShowing(true);
};/** @include "index.js" */

/**
 * Настройки.
 *
 * Любые настройки ниже - настройки по-умолчанию, вы можете удалить их,
 * если они вам не нужны.
 */
ModularGrid.init(
	{
		// настройки гайдов
		guides: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть направляющие
			 */
			shouldToggleVisibility:
				function (params) {
					// Ctrl + ;
					var result = !params.occured_in_form && (params.ctrlKey && (params.character == ';' || params.keyCode == 186));
					return result;
				},

			/**
			 * Стиль линий-направляющих.
			 * Значения аналогичны значениям CSS-свойства border-style.
			 * @type String
			 */
			lineStyle: 'solid',
			/**
			 * Цвет линий-направляющих.
			 * Значения аналогичны значениям CSS-свойства border-color.
			 * @type String
			 */
			lineColor: '#9dffff',
			/**
			 * Толщина линий-направляющих.
			 * Значения аналогичны значениям CSS-свойства border-width.
			 * @type String
			 */
			lineWidth: '1px',

			/**
			 * значения CSS-свойства z-index HTML-контейнера всех направляющих
			 * @type Number
			 */
			'z-index': 255,

			/**
			 * Массив настроек направляющих (задается в формате items:[{настройки-1},{настройки-2},...,{настройки-N}]).
			 * @type Array
			 */
			items: [
				{
					/**
					 * Две центрированные направляющие
					 *
					 * Ширина задается параметром width (значения аналогичны значениям CSS-свойства width),
					 * две направляющие рисуются слева и справа от центрированной области заданной ширины.
					 */
					type: 'center',
					width: '600px'
				},
				{
					/**
					 * Одна вертикальная направляющая
					 *
					 * Можно задать либо отступ от левого края рабочей области браузера параметром left,
					 * либо отступ от правого края рабочей области браузера параметром right.
					 * Значения параметров аналогичны значениям CSS-свойства left.
					 */
					type: 'vertical',
					left: '33%'
				},
				{
					/**
					 * Одна горизонтальная направляющая
					 *
					 * Можно задать либо отступ от верхнего края рабочей области браузера параметром top,
					 * либо отступ от нижнего края рабочей области браузера параметром bottom.
					 * Значения параметров аналогичны значениям CSS-свойства top.
					 */
					type: 'horizontal',
					top: '48px'
				}
			]
		},

		grid: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть вертикальную сетку
			 */
			shouldToggleVerticalGridVisibility:
				function (params) {
					// Shift + v
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'v' );
					return result;
				},

			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть горизонтальную сетку
			 */
			shouldToggleHorizontalGridVisibility:
				function (params) {
					// Shift + h
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'h' );
					return result;
				},

			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скыть шрифтовую сетку
			 */
			shouldToggleFontGridVisibility:
				function (params) {
					// Shift + f
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'f' );
					return result;
				},

			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть сетку целиком
			 */
			shouldToggleVisibility:
				function (params) {
					// Ctrl + '
					// скрывает если хотя бы один из элементов сетки показан (шрифтовая, колонки или строки)
					var result = !params.occured_in_form && (params.ctrlKey && (params.character == "'" || params.keyCode == 222));
					return result;
				},

			'z-index': 255,

			/**
			 * Цвет фона колонок и строк модульной сетки.
			 * Цвет линий шрифтовой сетки задаётся отдельно.
			 * @see lineColor
			 * @type String
			 */
			color: "#F00",

			/**
			 * Центрировать ли сетку
			 * @type Boolean
			 */
			centered: true,

			prependGutter: false,
			appendGutter: false,

			gutter: 16,

			/**
			 * Количество вертикальных модулей (столбцов сетки)
			 * @see lineHeight
			 * @type Number
			 */
			vDivisions: 3,

			/**
			 * Высота строки модульной сетки в строках модульной сетки.
			 * @see lineHeight
			 * @type Number
			 */
			hDivisions: 3,

			/**
			 * Отступ от верхнего края рабочей области браузера до шрифтовой и горизонтальной сетки в пикселах.
			 * @type Number
			 */
			marginTop: 0,
			/**
			 * Отступ от левого края рабочей области браузера до сетки.
			 * Значения аналогичны значениям CSS-свойства margin-left
			 * @type Number
			 */
			marginLeft: '0px',
			/**
			 * Отступ от правого края рабочей области браузера до сетки.
			 * Значения аналогичны значениям CSS-свойства margin-right
			 * @type Number
			 */
			marginRight: '0px',

			/**
			 * Ширина контейнера с сеткой.
			 * Для резиновой сетки задавать как '100%' и обязательно указывать minWidth
			 * Для сетки с фиксированной шириной указывать только число, например 640 для ширины 640 пикселов
			 * @type Number
			 */
			width: 600,
			/**
			 * Минимальная ширина контейнера с сеткой.
			 * Указывать только число, например 640 для ширины 640 пикселов
			 * @type Number
			 */
			minWidth: null,
			/**
			 * Максимальная ширина контейнера с сеткой.
			 * Указывать только число, например 1240 для ширины 1240 пикселов
			 * @type Number
			 */
			maxWidth: null,

			/**
			 * Высота строки в пикселах.
			 * Используется для рисования шрифтовой сетки.
			 * Сама линия сетки начинает рисоваться на (lineHeight + 1) пикселе
			 * @type Number
			 */
			lineHeight: 16,

			// стиль линий шрифтовой сетки
			/**
			 * Стиль линий шрифтовой сетки.
			 * Значения аналогичны значениям CSS-свойства border-style
			 * @type String
			 */
			lineStyle: 'solid',
			/**
			 * Толщина линий шрифтовой сетки.
			 * Значения аналогичны значениям CSS-свойства border-width
			 * @type String
			 */
			lineWidth: '1px',
			/**
			 * Цвет линий шрифтовой сетки.
			 * Значения аналогичны значениям CSS-свойства border-color
			 * @type String
			 */
			lineColor: "#555"
		},

		resizer: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно изменить размер на следующий из заданных
			 */
			shouldToggleSize:
				function (params) {
					// Shift + r
					var result = !params.occured_in_form && (params.shiftKey && params.character == 'r');
					return result;
				},

			/**
			 * Нужно ли в title окна указывать разрешение
			 * @type Boolean
			 */
			changeTitle: true,

			sizes:
				[
					{
						width: 640,
						height: 480
					},
					{
						width: 800,
						height: 600
					},
					{
						width: 1024,
						height: 768
					},
					{
						width: 1280,
						height: 1024
					}
				]
		},

		// настройки макета-изображения
		image: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно показать/скрыть изображение
			 */
			shouldToggleVisibility:
				function (params) {
					// Ctrl + \
					var result = !params.occured_in_form && (params.ctrlKey && (params.character == '\\' || params.keyCode == 28 || params.keyCode == 220));
					return result;
				},

			/**
			 * Значения CSS-свойства z-index HTML-контейнера изображения
			 * @type Number
			 */
			'z-index': 255,

			/**
			 * Начальное значение прозрачности изображения от 0 до 1 (0 - абсолютно прозрачное, 1 - абсолютно непрозрачное)
			 * @type Number
			 */
			opacity: 0.85,
			/**
			 * Шаг изменения значения прозрачности для изображения от 0 до 1
			 * @type Number
			 */
			opacityStep: 0.05,

			/**
			 * Центрировать ли изображение относительно ширины рабочей области браузера
			 * @type Boolean
			 */
			centered: true,

			/**
			 * Отступ от верхнего края рабочей области браузера до изображения в пикселах
			 * @type Number
			 */
			marginTop: 100,
			/**
			 * Отступ от левого края рабочей области браузера до изображения.
			 * Возможные значения аналогичны значениям CSS-свойства margin-left
			 * @type Number
			 */
			marginLeft: '0px',
			/**
			 * Отступ от правого края рабочей области браузера до изображения.
			 * Возможные значения аналогичны значениям CSS-свойства margin-left
			 * @type Number
			 */
			marginRight: '0px',

			/**
			 * URL файла изображения
			 * @type String
			 */
			src: 'design.png',

			/**
			 * Ширина изображения в пикселах
			 * @type Number
			 */
			width: 300,
			/**
			 * Высота изображения в пикселах
			 * @type Number
			 */
			height: 356
		},

		opacity: {
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно сделать изображение менее прозрачным на opacityStep процентов
			 */
			shouldStepUpOpacity:
				function (params) {
					// Shift + ]
					var result = !params.occured_in_form && (params.shiftKey && params.keyCode == 221);
					return result;
				},
			/**
			 * Функция вызывается каждый раз при нажатии клавиш в браузере.
			 * @param {Object} params информация о нажатой комбинации клавиш (params.ctrlKey, params.altKey, params.keyCode)
			 * @return {Boolean} true, если нужно сделать изображение более прозрачным на opacityStep процентов
			 */
			shouldStepDownOpacity:
				function (params) {
					// Shift + [
					var result = !params.occured_in_form && (params.shiftKey && params.keyCode == 219);
					return result;
				},

			/**
			 * Начальное значение прозрачности изображения от 0 до 1 (0 - абсолютно прозрачное, 1 - абсолютно непрозрачное)
			 * @type Number
			 */
			opacity: 0.25,
			/**
			 * Шаг изменения значения прозрачности для изображения от 0 до 1
			 * @type Number
			 */
			opacityStep: 0.05
		},

		gui: {
			toggler: {
				style: {
					position: "absolute",
					right: '10px',
					top: '10px',
					'z-index': 1000
				},

				label: "Настройки сетки"
			},

			pane: {
				style: {
					position: "absolute",
					right: '10px',
					top: '35px',

					width: 'auto',
					height: 'auto',

					margin: '0',
					padding: '7px 5px',

					background: '#FFF',
					border: '2px solid #CCC',

					'z-index': 1000
				},

				labels: {
					guides: 'гайды <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + ;</span>',
					size: 'выберите размер (Shift + r)',
					grid: {
						all: 'сетка <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \'</span>',
						font: 'шрифтовая <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + f</span>',
						vertical: 'вертикальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + v</span>',
						horizontal: 'горизонтальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + h</span>'
					},
					image: 'изображение-макет <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \</span>',
					opacity: 'прозрачность'
				}
			}
		}

	}
);