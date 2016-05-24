(function() {
	'use strict';

	angular
		.module('metaidApp')
		.factory('ProfileService', ProfileService);

	ProfileService.$inject = ['$http', 'Upload', 'API_URI_PREFIX'];

	function ProfileService($http, Upload, API_URI_PREFIX) {
		var vm = this;
    var profileSelected = {};

		var service = {
      listProfile: listProfile,
			createProfile: createProfile,
      uploadPortfolio: uploadPortfolio,
      insertVideo: insertVideo,
      getProfile: getProfile,
      getProfileSelected: getProfileSelected,
      setProfile: setProfile,
      updateProfile: updateProfile,
      removePortfolioItem: removePortfolioItem,
      removeProfile: removeProfile,
      isUploadInProgress: isUploadInProgress
		};
		return service;

    function listProfile(ente) {
      return $http.get(API_URI_PREFIX + '/entes/' + ente.slug + '/perfis/');
    }

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

    function insertVideo(profile, video) {
      return $http.post(API_URI_PREFIX + '/perfis/' + profile.slug + '/portfolios/video', {
        perfil: profile.id_pub,
        nome: video.title,
        url: video.url,
        plataforma: new URL(video.url).hostname
      });
    }

    function getProfile(slug) {
      return $http.get(API_URI_PREFIX + '/perfis/' + slug);
    }

    function setProfile(profile) {
      profileSelected = profile;
    }

    function getProfileSelected() {
      return profileSelected;
    }

    function updateProfile(profile) {
      return $http.put(API_URI_PREFIX + '/perfis/' + profile.slug + '/', profile);
    }

    function removePortfolioItem(profile, type, item) {
      var url = API_URI_PREFIX + '/perfis/' + profile.slug + '/portfolios/' + type + '/' + item.id_pub + '/';
      return $http.delete(url);
    }

    function removeProfile(profile) {
      return $http.delete(API_URI_PREFIX + '/perfis/' + profile.slug + '/');
    }

    function isUploadInProgress () {
      return Upload.isUploadInProgress();
    }
	}
})();
