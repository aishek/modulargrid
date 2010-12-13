/** @include "index.js" */

/**
 * Меняет состояние объекта по внешнему событию.
 * @constructor
 * @param {ModularGrid.EventProvider} eventProvider прослойка, чье событие слушать
 * @param {Function} shouldChange если вернет true при возникновении события от eventProvider, то вызовится stateChange
 * @param {Function} stateChange вызывается, когда нужно поменять состояние
 * @return {ModularGrid.StateChanger}
 */
ModularGrid.Utils.StateChanger = function (eventProvider, shouldChange, stateChange) {
	eventProvider.addHandler(
		function (params) {
			if ( shouldChange(params) )
				stateChange();
		}
	);

	return this;
};
