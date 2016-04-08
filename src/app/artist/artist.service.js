(function () {
  'use strict';

  angular
    .module('metaidApp')
    .factory('ArtistService', ArtistService);

  ArtistService.$inject = ['$http', 'API_URI_PREFIX'];

  function ArtistService($http, API_URI_PREFIX) {
    return {
      query: query
    };

    function query() {
      return [
        {
          name: "Carlos Silva Camargo",
          ente_info: {
            cpf: "102.917.181-12",
            ceac: 1230
          },
          main_classification: "Música"
        },
        {
          name: "Adriana de Andrade",
          ente_info: {
            cpf: "539.461.301-40",
            ceac: 1340
          },
          main_classification: "Dança"
        },
        {
          name: "Santiago Machado Dellape",
          ente_info: {
            cpf: "000.543.121-33",
            ceac: 1030
          },
          main_classification: "Música"
        },
        {
          name: "Daniela Marinho Martins",
          ente_info: {
            cpf: "708.616.501-93",
            ceac: 2578
          },
          main_classification: "Artes Plásticas"
        }
      ];
    }
  }
}());
