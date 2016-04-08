(function() {
	'use strict';

	angular
		.module('metaidApp')
		.controller('DashboardController', DashboardController);

	// DashboardController.$inject = [];

	function DashboardController() {
		var vm = this;

		// Functions
		vm.init = init;

		function init() {};

	}
})();
