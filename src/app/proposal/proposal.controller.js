(function() {
	'use strict';

	angular
	.module('metaidApp')
	.controller('ProposalController', ProposalController)
	.controller('ProposalNewController', ProposalNewController)
	.controller('ProposalDetailsController', ProposalDetailsController)
	.controller('ProposalUpdateController', ProposalUpdateController)
	.controller('ProposalDeleteController', ProposalDeleteController)
	.controller('ProposalCancelController', ProposalCancelController)
	.controller('ProposalDashboardController', ProposalDashboardController)
	.controller('ProposalAnalysisController', ProposalAnalysisController)
	.controller('ProposalAnalysisDetailsController', ProposalAnalysisDetailsController);

	ProposalController.$inject = [
		'$mdDialog',
		'UserService',
		'ProposalService',
		'AlertService',
		'PROPOSAL_LIMIT',
		'PROPOSAL_STATUS'
	];
	ProposalNewController.$inject = [
		'$state',
		'$timeout',
		'$mdDialog',
		'ProposalService',
		'AlertService',
		'UtilsService',
		'UserService'
	];
	ProposalDetailsController.$inject = [
		'$state',
		'$stateParams',
		'ProposalService',
		'AlertService'
	];
	ProposalUpdateController.$inject = [
		'$state',
		'$timeout',
		'$stateParams',
		'$mdDialog',
		'ProposalService',
		'AlertService',
		'UtilsService'
	];
	ProposalDeleteController.$inject = [
		'$mdDialog',
		'$state',
		'ProposalService',
		'AlertService',
		'UserService'
	];
	ProposalCancelController.$inject = [
		'$mdDialog',
		'$state',
		'ProposalService'
	];
	ProposalDashboardController.$inject = ['ProposalService', 'AlertService'];
	ProposalAnalysisController.$inject = ['ProposalService', 'AlertService'];
	ProposalAnalysisDetailsController.$inject = ['$state', '$stateParams', 'ProposalService', 'AlertService'];

	/* @ngInject */
	function ProposalController($mdDialog, UserService, ProposalService,
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
			ProposalService.myProposals(user.id).then(function(response){
				vm.proposals = response.data;
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function deleteDialog(event, number) {
			ProposalService.getProposal(number).then(function(response){
				ProposalService.setProposalSelected(response.data);
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
			ProposalService.getProposal(number).then(function(response){
				ProposalService.setProposalSelected(response.data);
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
				if(ProposalService.disableProposal(proposal)) {
					disable_total++;
				}
				if(ProposalService.enableProposal(proposal)) {
					enable_total++;
				}
			});
			return (disable_total + enable_total) === PROPOSAL_LIMIT;
		}
	}

	/* @ngInject */
	function ProposalNewController($state, $timeout, $mdDialog, ProposalService,
																 AlertService, UtilsService) {
		var vm = this;

		vm.proposal = {};
		vm.errors = [];
		vm.errorFiles = [];
		vm.acceptFiles = UtilsService.accept_files();

		// Functions
		vm.init = init;
		vm.uploadFiles = uploadFiles;
		vm.isFiles = isFiles;
		vm.removeDocumentToUpload = removeDocumentToUpload;
		vm.createProposal = createProposal;
		vm.sendProposal = sendProposal;

		function init() {
			vm.proposal.attachments = [];
		}

		function uploadFiles(files, errorFiles) {
			if(files !== null && (errorFiles === null || errorFiles.length === 0)) {
				vm.proposal.attachments = vm.proposal.attachments.concat(files);
			}

			if(errorFiles !== null) {
				vm.errorFiles = errorFiles;
			}
		}

		function isFiles() {
			return vm.proposal.attachments.length > 0;
		}

		function removeDocumentToUpload (attachment) {
			vm.proposal.attachments = vm.proposal.attachments.filter(function(item) {
				if(item.$$hashKey !== attachment.$$hashKey) {
					return item;
				}
			});
		}

		function createProposal() {
			showDialog();
			ProposalService.createProposal(vm.proposal).then(function(response) {
				if(response.status === 201) {

					ProposalService.setProposalSelected(response.data);
					vm.proposal.attachments.forEach(function(file){
						uploadDocuments(response.data, file, function() {
							$state.go('admin.propostas');
						});
					});
				}
			}, function(error){
				$mdDialog.hide();
				vm.errors = AlertService.message(error);
			});
		}

		function sendProposal() {
			showDialog();
			ProposalService.sendProposal(vm.proposal).then(function(response) {
				if(response.status === 201) {
					ProposalService.setProposalSelected(response.data);
					vm.proposal.attachments.forEach(function(file){
						uploadDocuments(response.data, file, function() {
							$state.go('admin.propostas.detalhe_impressao',
												{number: response.data.number});
						});
					});
				}
			}, function(error){
				$mdDialog.hide();
				vm.errors = AlertService.message(error);
			});
		}

		function uploadDocuments(data, file, after_upload) {
			file.upload = ProposalService.uploadDocument(data, file);

			file.upload.then(function() {
				if (!ProposalService.isUploadIsProgress()) {
					$timeout(function() {
						$mdDialog.hide();
						after_upload();
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
				controller: ProposalNewController,
				controllerAs: 'vm',
				templateUrl: 'proposal/creating_proposal.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
				escapeToClose: false
			});
		}
	}

	/* @ngInject */
	function ProposalDetailsController($state, $stateParams, ProposalService, AlertService) {
		var vm = this;

		vm.proposal = {};

		vm.init = init;

		function init() {
			ProposalService.getProposal($stateParams.number).then(function(response) {
				vm.proposal = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}
	}

	/* @ngInject */
	function ProposalUpdateController($state, $timeout, $stateParams, $mdDialog,
									  ProposalService, AlertService, UtilsService) {
		var vm = this;

		vm.proposal = {};
		vm.proposal.attachments = [];
		vm.proposal.new_attachments = [];
		vm.errors = [];
		vm.errorFiles = [];
		vm.acceptFiles = UtilsService.accept_files();

		// Functions
		vm.init = init;
		vm.uploadFiles = uploadFiles;
		vm.isFiles = isFiles;
		vm.updateProposal = updateProposal;
		vm.sendProposal = sendProposal;
		vm.deleteDocument = deleteDocument;
		vm.removeDocumentToUpload = removeDocumentToUpload;

		function init() {
			ProposalService.getProposal($stateParams.number).then(function(response) {
				vm.proposal = response.data;
				vm.proposal.new_attachments = [];
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function uploadFiles(files, errorFiles) {
			if(files !== null && (errorFiles === null || errorFiles.length === 0)) {
				vm.proposal.new_attachments = vm.proposal.new_attachments.concat(files);
			}

			if(errorFiles !== null) {
				vm.errorFiles = errorFiles;
			}
		}

		function isFiles() {
			return (vm.proposal.new_attachments.length > 0) || (vm.proposal.attachments.length > 0);
		}

		function updateProposal() {
			showDialog();
			ProposalService.updateProposal(vm.proposal).then(function(response) {
				if (vm.proposal.new_attachments.length > 0) {
					vm.proposal.new_attachments.forEach(function(file){
						uploadDocuments(response.data, file);
						$state.go('admin.propostas');
					});
				} else {
					$mdDialog.hide();
					$state.go('admin.propostas');
				}
			}, function(error) {
				$mdDialog.hide();
				vm.errors = AlertService.message(error);
			});
		}

		function sendProposal() {
			showDialog();
			ProposalService.updateAndSendProposal(vm.proposal).then(function(response) {
				if (vm.proposal.new_attachments.length > 0) {
					vm.proposal.new_attachments.forEach(function(file){
						uploadDocuments(response.data, file);
					});
				} else {
					$mdDialog.hide();
					$state.go('admin.propostas.detalhe_impressao',
										{number: response.data.number});
				}
			}, function(error) {
				$mdDialog.hide();
				vm.errors = AlertService.message(error);
			});
		}

		function deleteDocument(attachment) {
			ProposalService.deleteDocument(attachment.uid).then(function(response) {
				if(response.status === 204) {
					vm.proposal.attachments = vm.proposal.attachments.filter(function(item) {
						if(item.uid !== attachment.uid) {
							return item;
						}
					});
				}
			});
		}

		function removeDocumentToUpload (attachment) {
			vm.proposal.new_attachments = vm.proposal.new_attachments.filter(function(item) {
				if(item.$$hashKey !== attachment.$$hashKey) {
					return item;
				}
			});
		}

		function uploadDocuments(data, file) {
			file.upload = ProposalService.uploadDocument(data, file);

			file.upload.then(function() {
				if (!ProposalService.isUploadIsProgress()) {
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
				controller: ProposalUpdateController,
				templateUrl: 'proposal/updating_proposal.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
				escapeToClose: false
			});
		}
	}

	/* @ngInject */
	function ProposalDeleteController($mdDialog, $state, ProposalService) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.hide = hide;
		vm.cancel = cancel;
		vm.deleteProposal = deleteProposal;

		vm.errors = [];

		function init() {

		}

		function hide() {
			$mdDialog.hide();
		}

		function cancel() {
			$mdDialog.cancel();
		}

		function deleteProposal() {
			ProposalService.deleteProposal().then(function() {
				$mdDialog.hide();
				$state.transitionTo('admin.propostas');
			});
		}
	}

	/* @ngInject */
	function ProposalCancelController($mdDialog, $state, ProposalService) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.hide = hide;
		vm.cancel = cancel;
		vm.cancelProposal = cancelProposal;

		vm.errors = [];

		function init() {
		}

		function hide() {
			$mdDialog.hide();
		}

		function cancel() {
			$mdDialog.cancel();
		}

		function cancelProposal() {
			ProposalService.cancelProposal();
			$mdDialog.hide();
			$state.transitionTo('admin.propostas');
		}
	}

	/* @ngInject */
	function ProposalDashboardController(ProposalService, AlertService) {
		var vm = this;

		// Functions
		vm.init = init;

		vm.dashboard = [];
		vm.errors = [];

		function init() {
			ProposalService.dashboard().then(function(response) {
				vm.dashboard = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

	}

	/* @ngInject */
	function ProposalAnalysisController(ProposalService, AlertService) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.nextPage = nextPage;
		vm.previousPage = previousPage;

		vm.proposals = [];
		vm.errors = [];

		function init() {
			ProposalService.query().then(function(response) {
				vm.proposals = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function nextPage() {
			ProposalService.queryPaginate(vm.proposals.next).then(function(response) {
				vm.proposals = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function previousPage() {
			ProposalService.queryPaginate(vm.proposals.previous).then(function(response) {
				vm.proposals = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

	}

	/* @ngInject */
	function ProposalAnalysisDetailsController($state, $stateParams, ProposalService, AlertService) {
		var vm = this;

		// Functions
		vm.init = init;
		vm.approveProposal = approveProposal;
		vm.reproveProposal = reproveProposal;

		vm.proposal = {};
		vm.errors = [];

		function init() {
			ProposalService.getProposal($stateParams.number).then(function(response) {
				vm.proposal = response.data;
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function approveProposal() {
			ProposalService.approveProposal(vm.proposal).then(function() {
				$state.go('admin.propostas.analise');
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}

		function reproveProposal() {
			ProposalService.reproveProposal(vm.proposal).then(function() {
				$state.go('admin.propostas.analise');
			}, function(error) {
				vm.errors = AlertService.message(error);
			});
		}
	}
})();
