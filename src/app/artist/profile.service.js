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
      uploadPortfolio: uploadPortfolio,
      isUploadInProgress: isUploadInProgress
		};
		return service;

		function createProfile(ente, profile) {
			return $http.post(API_URI_PREFIX + '/entes/' + ente.slug + '/perfis/', profile);
		};

    function uploadPortfolio(profile, arquivo, type) {
      var data = {};
      if(type === 'file') {
        data = {
          arquivo: arquivo,
          nome: arquivo.filename
        };
      }
      if(type === 'image') {
        data = {
          arquivo: arquivo,
          descricao: arquivo.description
        };
      }
      if(type === 'audio') {
        data = {
          audio: arquivo,
          nome: arquivo.filename
        };
      }

      return Upload.upload({
        url: API_URI_PREFIX + '/perfis/' + profile.slug + '/portfolios/' + type,
        data: data
      });
    }

    function isUploadInProgress () {
      return Upload.isUploadInProgress();
    }
	}
})();
