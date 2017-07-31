/*
 * Adapted from First Visit Popup jQuery Plugin version 1.2
 * Chris Cook - chris@chris-cook.co.uk
 */

(function ($) {

	'use strict';
	$.fn.firstVisitPopup = function (settings) {

		var $dialog = $(this);

		var setCookie = function (name, value) {
			var date = new Date(),
				expires = 'expires=';
			date.setTime(date.getTime() + 31536000000);
			expires += date.toGMTString();
			document.cookie = name + '=' + value + '; ' + expires + '; path=/';
		}
		var getCookie = function (name) {
			var allCookies = document.cookie.split(';'),
				cookieCounter = 0,
				currentCookie = '';
			for (cookieCounter = 0; cookieCounter < allCookies.length; cookieCounter++) {
				currentCookie = allCookies[cookieCounter];
				while (currentCookie.charAt(0) === ' ') {
					currentCookie = currentCookie.substring(1, currentCookie.length);
				}
				if (currentCookie.indexOf(name + '=') === 0) {
					return currentCookie.substring(name.length + 1, currentCookie.length);
				}
			}
			return false;
		}
		var initializeModal = function() {
			$dialog.modal({dismissible: false});
			$dialog.modal('open');
			setCookie('fvpp' + settings.cookieName, 'true');
		}
		var showMessage = function () {
			$dialog.children('.modal-content').load('/html/' + $dialog.children('.modal-content').attr('data-modal-content'), initializeModal);	
		}


		if (!getCookie('fvpp' + settings.cookieName)) {
			showMessage();
		}

	};

})(jQuery);
