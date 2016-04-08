(function () {
  'use strict';
  angular
    .module('metaidApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state'];

  /* @ngInject */
  function DashboardController($state) {
    var vm = this;

    vm.dashboard = {};

    vm.init = init;
    vm.statusSituation = statusSituation;

    function init() {
      vm.dashboard = {
        "situation": "approved"
      }
    }

    function statusSituation() {
      if(vm.dashboard.situation === "approved") {
        return true;
      } else {
        return false;
      }
    }
  }
}());
