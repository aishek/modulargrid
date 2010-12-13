/** @include "namespace.js" */

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

};