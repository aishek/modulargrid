/** @include "index.js" */

/**
 * Обертка события от браузера.
 * @constructor
 * @param {String} eventName название события, например "keydown"
 * @param {Function} prepareParams преобразователь event браузера в хеш для обработчика
 * @return {ModularGrid.EventProvider}
 */
ModularGrid.Utils.EventProvider = function(eventName, prepareParams, target) {
	this.eventName = eventName;
	this.prepareParams = prepareParams;
	this.target = target || 'document';

	this.handlers = null;

	return this;
};

/**
 * Формирует хеш параметоров с помощью this.prepareParams и вызывает все обработчики
 * @private
 * @param {Object} event
 */
ModularGrid.Utils.EventProvider.prototype.genericHandler = function(event) {
	var params = (this.prepareParams ? this.prepareParams(event) : event);

	for(var i = 0, length = this.handlers.length; i < length; i++)
		this.handlers[i](params);
};

/**
 * Создает массив обработчиков, вешает обработчик события браузера
 * @private
 */
ModularGrid.Utils.EventProvider.prototype.initHandlers = function () {
	this.handlers = [];

	var code = this.target + '.on' + this.eventName.toLowerCase() +  '=function(event){self.genericHandler(event);};';

	var self = this;
	eval(code);
};

/**
 * Добавляет обработчик события в конец очереди обработчиков
 * @param {Function} handler обработчик события
 */
ModularGrid.Utils.EventProvider.prototype.addHandler = function (handler) {
	if ( this.handlers == null )
		this.initHandlers();

	this.handlers[this.handlers.length] = handler;
};