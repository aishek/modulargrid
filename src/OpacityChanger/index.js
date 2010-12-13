ModularGrid.OpacityChanger = {

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
};