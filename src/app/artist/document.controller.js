(function() {
	'use strict';

	angular
	.module('metaidApp')
	.controller('DocumentController', DocumentController)
	.controller('DocumentNewController', DocumentNewController);

	DocumentController.$inject = [
		'$mdDialog',
		'UserService',
		'DocumentService',
		'AlertService',
		'PROPOSAL_LIMIT',
		'PROPOSAL_STATUS'
	];
	DocumentNewController.$inject = [
		'$state',
		'$timeout',
		'$mdDialog',
		'DocumentService',
		'AlertService',
		'UtilsService',
		'UserService'
	];

	/* @ngInject */
	function DocumentController($mdDialog, UserService, DocumentService,
															AlertService, PROPOSAL_LIMIT, PROPOSAL_STATUS) {
		var vm = this;

		vm.proposals = [];

		vm.errors = [];

		// Functions
		vm.init = init;
		vm.deleteDialog = deleteDialog;
		vm.cancelDialog = cancelDialog;
		vm.enablePrintProposal = enablePrintProposal;
		vm.disableNewProposal = disableNewProposal;

		function init() {
			listProposal();
		}

		function listProposal() {
			var user = UserService.getAuthenticatedAccount();
			DocumentService.myProposals(user.id).then(function(response){
				vm.proposals = response.data;
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function deleteDialog(event, number) {
			DocumentService.getProposal(number).then(function(response){
				DocumentService.setProposalSelected(response.data);
			});
			$mdDialog.show({
				controller: ProposalDeleteController,
				controllerAs: 'vm',
				templateUrl: 'proposal/proposal_delete.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false
			}).then(function() {
				listProposal();
			});
		}

		function cancelDialog(event, number) {
			DocumentService.getProposal(number).then(function(response){
				DocumentService.setProposalSelected(response.data);
			});
			$mdDialog.show({
				controller: ProposalCancelController,
				controllerAs: 'vm',
				templateUrl: 'proposal/proposal_cancel.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false
			}).then(function() {
				listProposal();
			});
		}

		function enablePrintProposal(proposal) {
			return PROPOSAL_STATUS.enable_print.indexOf(proposal.status) !== -1;
		}

		function disableNewProposal() {
			var disable_total = 0;
			var enable_total = 0;
			vm.proposals.forEach(function(proposal) {
				if(DocumentService.disableProposal(proposal)) {
					disable_total++;
				}
				if(DocumentService.enableProposal(proposal)) {
					enable_total++;
				}
			});
			return (disable_total + enable_total) === PROPOSAL_LIMIT;
		}
	}

	/* @ngInject */
	function DocumentNewController($state, $timeout, $mdDialog, DocumentService,
																 AlertService, UtilsService, UserService) {
		var vm = this;

		vm.document = {};
    vm.document.arquivo = {
      name: '',
      size: 0
    };
		vm.errors = [];
		vm.errorFiles = [];
		vm.acceptFiles = UtilsService.accept_files();

		// Functions
		vm.init = init;
    vm.isFile = isFile;
    vm.uploadFile = uploadFile;
		vm.createDocument = createDocument;

		function init() {
		}

    function isFile() {
      return vm.document.arquivo.size > 0;
    }

		function uploadFile(file, errorFiles) {
			if(file !== null && (errorFiles === null || errorFiles.length === 0)) {
        vm.document.arquivo = file;
			}

			if(errorFiles !== null) {
				vm.errorFiles = errorFiles;
			}
		}

		function createDocument() {
      vm.usuario = UserService.getAuthenticatedAccount();

      vm.document.upload = DocumentService.createDocument(vm.usuario.ente, vm.document);
			vm.document.upload.then(function() {
				if (!DocumentService.isUploadIsProgress()) {
					$timeout(function() {
						$mdDialog.hide();
					}, 300);
				}
			}, function(response) {
				if(response.status > 0) {
					$mdDialog.hide();
					vm.errors = AlertService.error('Erro ao enviar arquivo: ' + response.data);
				}
			});
		}

		function showDialog(ev) {
			$mdDialog.show({
				controller: DocumentNewController,
				templateUrl: 'artist/creating_document.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
				escapeToClose: false
			});
		}
	}
})();
