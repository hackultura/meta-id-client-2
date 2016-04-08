(function () {
	'use strict';

	angular
		.module('metaidApp')
		.factory('ClassificationService', ClassificationService);

	ClassificationService.$inject = ['$http', '$cookies', 'API_URI_PREFIX'];

	function ClassificationService($http, $cookies, API_URI_PREFIX) {
		var vm = this;
		vm.ente = {};
		vm.atuacoes = [];
		vm.classificacoes = [];

		return {
      queryAtuacoes: queryAtuacoes,
      queryAreas: queryAreas,
      queryEstilos: queryEstilos
		};

		function queryAtuacoes() {
			return $http.get(API_URI_PREFIX + '/atuacoes/');
		}

		function queryAreas() {
			var areas = [];

			queryClassificacoes().then(function(response){
				vm.classificacoes = response.data;

				for(var i = 0; i < vm.classificacoes.length; i++) {
					areas.push({index: i, value: vm.classificacoes[i].area});
				}
			}, function(responseError) {
				console.log("Erro ao listar as classificacoes: " + responseError.data);
			});

			return areas;
		};

		function queryEstilos(index) {
			return vm.classificacoes[index].estilos;
		}

		function queryClassificacoes() {
			return $http.get(API_URI_PREFIX + '/classificacoes/');
		}
  }
}());
