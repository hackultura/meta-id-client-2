(function () {
  'use strict';
  angular
    .module('metaidApp')
    .controller('ArtistController', ArtistController);

  ArtistController.$inject = ['$state', 'ArtistService'];

  /* @ngInject */
  function ArtistController($state, ArtistService) {
    var vm = this;

    vm.artists = {};
    vm.artists.results = [];

    vm.init = init;

    function init() {
      vm.artists.results = ArtistService.query();
    }
  }
}());
