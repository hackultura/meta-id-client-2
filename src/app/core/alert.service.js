(function () {
	'use strict';

	angular
		.module('metaidApp')
		.factory('AlertService', AlertService);

	function AlertService() {
		var msgInfo = {};
		var alert = false;
		return {
			message: message,
			success: success,
			error: error,
			info: info,
			hasAlert: hasAlert
		};

		function message(error) {
			if(error.status === -1) {
				return ['Ocorreu um problema no acesso a base de dados. Por favor, contacte a Secretaria de Cultura ou tente mais tarde.'];
			} else {
				return error.data.errors;
			}
		}

		function success(value) {
			return [[value]];
		}

		function error(value) {
			return [[value]];
		}

		function info(value) {
			msgInfo = value;
			alert = true;
		}

		function hasAlert() {
			return alert;
		}
	}
}());
