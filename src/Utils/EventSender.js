/** @include "index.js" */

/**
 * Объект, который умеет посылать события.
 * @constructor
 * @return {ModularGrid.EventSender}
 */
ModularGrid.Utils.EventSender = function() {
	this.handlers = {};

	return this;
};

/**
 * Добавляет обработчик события в конец очереди обработчиков
 * @param {String} eventName название события
 * @param {Function} handler обработчик события
 */
ModularGrid.Utils.EventSender.prototype.addHandler = function (eventName, handler) {
	if ( !this.handlers[eventName] ) {
		this.handlers[eventName] = [];
	}

	this.handlers[eventName][this.handlers[eventName].length] = handler;
};

/**
 * Вызывает обработчики события с указанными параметрами
 * @param {String} eventName название события
 * @param {Object} params параметры обработчиков событий
 */
ModularGrid.Utils.EventSender.prototype.occurEvent = function (eventName, params) {
	var target = this.handlers[eventName];

	if ( this.handlers[eventName] ) {
		for(var i = 0, length = this.handlers[eventName].length; i < length; i++ ) {
			this.handlers[eventName][i](params);
		}
	}
};