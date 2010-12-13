/** @include "index.js */

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
};