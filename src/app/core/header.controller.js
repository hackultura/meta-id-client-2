(function() {
	'use strict';

	angular
	.module('metaidApp')
	.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['$scope', '$mdSidenav', '$state', 'UserService'];

	/* @ngInject */
	function HeaderController($scope, $mdSidenav, $state, UserService) {
		var vm = this;

		// Variables
		vm.user = {};

		// Functions
		vm.init = init;
		vm.toggleSidenav = toggleSidenav;
		vm.logout = logout;

		function init() {
			$scope.$watch(function() {
				return UserService.getAuthenticatedAccount();
			}, function(newAuthenticatedaccount) {
				vm.user = newAuthenticatedaccount;
			}, true);
		}

		function toggleSidenav(menu) {
			$mdSidenav(menu).toggle();
		}

		function logout() {
			UserService.unauthenticate();
			$state.transitionTo('simple.login');
		}
	}
})();
