/** @include "index.js */

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
};