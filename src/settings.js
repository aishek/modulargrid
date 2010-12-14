/** @include "index.js" */

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