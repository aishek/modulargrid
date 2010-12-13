/** @include "index.js */

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
};