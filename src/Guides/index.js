/** @include "namespace.js" */

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

};