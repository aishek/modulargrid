/**
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
};