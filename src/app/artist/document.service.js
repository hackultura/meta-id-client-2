(function () {
	'use strict';

	angular
		.module('metaidApp')
		.factory('DocumentService', DocumentService);

	DocumentService.$inject = ['$http', 'Upload', 'API_URI_PREFIX'];

	function DocumentService($http, Upload, API_URI_PREFIX) {
		return {
      query: query,
			createDocument: createDocument,
      isUploadIsProgress: isUploadIsProgress,
		};

    function query() {

    }

    function createDocument(ente, documento) {
      documento.dono = ente.id_pub;
      console.log(documento);
			return Upload.upload({
				url: API_URI_PREFIX + '/documentos/',
				data: documento
			});
    }

		function isUploadIsProgress () {
			return Upload.isUploadInProgress();
		}
	}
}());
