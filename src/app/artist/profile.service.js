(function() {
	'use strict';

	angular
		.module('metaidApp')
		.factory('ProfileService', ProfileService);

	ProfileService.$inject = ['$http', 'Upload', 'API_URI_PREFIX'];

	function ProfileService($http, Upload, API_URI_PREFIX) {
		var vm = this;

		var service = {
			createProfile: createProfile,
		};
		return service;

		function createProfile(ente, profile) {
			return $http.post(API_URI_PREFIX + '/entes/' + ente.slug + '/perfis/', profile);
		};
	}
})();
