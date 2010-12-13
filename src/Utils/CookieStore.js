/** @include "index.js" */

ModularGrid.Utils.CookieStore = {

	setValue: function(name, value) {
		ModularGrid.Utils.CookieStore.setCookie(name, value)
	},

	getValue: function(name) {
		return ModularGrid.Utils.CookieStore.getCookie(name);
	},

	/**
	 * Backend to save value
	 * @private
	 * @param {String} name имя сохраняемой переменной
	 * @param {Object} value занчение сохраняемой переменной
	 */
	setCookie: function(name, value) {
		var today = new Date(), expires = new Date();
		expires.setTime(today.getTime() + 31536000000); //3600000 * 24 * 365

		document.cookie = name + "=" + escape(value) + "; expires=" + expires;
	},

	/**
	 * Backend to restore value
	 * @private
	 * @param {String} name имя сохранённой переменной
	 * @return {Object} значение сохранённой переменной
	 */
	getCookie: function(name) {
		var cookie = " " + document.cookie;
		var search = " " + name + "=";
		var setStr = null;
		var offset = 0;
		var end = 0;

		if (cookie.length > 0) {
			offset = cookie.indexOf(search);
			if (offset != -1) {
				offset += search.length;
				end = cookie.indexOf(";", offset)
				if (end == -1) {
					end = cookie.length;
				}
				setStr = unescape(cookie.substring(offset, end));
			}
		}

		return(setStr);
	}

};