/**
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

}