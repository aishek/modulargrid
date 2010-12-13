/**
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

};