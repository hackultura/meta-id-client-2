(function() {
	'use strict';

	angular
	.module('metaidApp')
	.controller('ProfileController', ProfileController)
	.controller('ProfileNewController', ProfileNewController);

	ProfileController.$inject = [
		'$mdDialog',
		'UserService',
		'ProfileService',
		'AlertService',
		'PROPOSAL_LIMIT',
		'PROPOSAL_STATUS'
	];
	ProfileNewController.$inject = [
		'$state',
		'$timeout',
		'$mdDialog',
		'ProfileService',
		'AlertService',
		'UtilsService',
		'UserService'
	];

	/* @ngInject */
	function ProfileController($mdDialog, UserService, ProfileService,
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
			ProfileService.myProposals(user.id).then(function(response){
				vm.proposals = response.data;
			}, function(error){
				vm.errors = AlertService.message(error);
			});
		}

		function deleteDialog(event, number) {
			ProfileService.getProposal(number).then(function(response){
				ProfileService.setProposalSelected(response.data);
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
			ProfileService.getProposal(number).then(function(response){
				ProfileService.setProposalSelected(response.data);
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
				if(ProfileService.disableProposal(proposal)) {
					disable_total++;
				}
				if(ProfileService.enableProposal(proposal)) {
					enable_total++;
				}
			});
			return (disable_total + enable_total) === PROPOSAL_LIMIT;
		}
	}

	/* @ngInject */
	function ProfileNewController($state, $timeout, $mdDialog, ProfileService,
																 AlertService, UtilsService, UserService) {
		var vm = this;

		vm.profile = {};
    vm.portfolio = {
      'file': [],
      'image': [],
      'audio': [],
      'video': []
    };
    vm.portfolio_file = {};
    vm.portfolio_image = {};
    vm.portfolio_audio = {};
    vm.portfolio_video = {};
		vm.errors = [];
		vm.errorFiles = [];
		vm.acceptFiles = UtilsService.accept_files();
    vm.acceptAudio = UtilsService.accept_audio_files();
    vm.acceptImage = UtilsService.accept_image_files();
    vm.acceptVideo = UtilsService.accept_video_files();
    vm.enablePortfolio = false;

		// Functions
		vm.init = init;
		vm.createProfile = createProfile;
    vm.uploadFiles = uploadFiles;
    vm.finishProfile = finishProfile;

		function init() {
		}

		function createProfile() {
      vm.ente = UserService.getAuthenticatedAccount();
      ProfileService.createProfile(vm.ente, vm.profile).then(function(response) {
        vm.enablePortfolio = true;
        vm.profile = response.data;
      });
		}

		function uploadFiles(files, errorFiles, type) {
			if(files !== null && (errorFiles === null || errorFiles.length === 0)) {
        prepareFiles(files, type);
			}

			if(errorFiles !== null) {
				vm.errorFiles = errorFiles;
			}
		}

    function finishProfile() {
			showDialog();
      vm.portfolio['file'].forEach(function(file) {
        uploadDocuments(vm.profile, file, 'file');
      });

      vm.portfolio['image'].forEach(function(file) {
        uploadDocuments(vm.profile, file, 'image');
      });

      vm.portfolio['audio'].forEach(function(file) {
        uploadDocuments(vm.profile, file, 'audio');
      });
    }

    function uploadDocuments(profile, arquivo, type) {
      file.upload = ProfileService.uploadPortfolio(profile, arquivo, type);

      file.upload.then(function() {
        if (!ProfileService.isUploadIsProgress()) {
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
        controller: ProfileNewController,
        controllerAs: 'vm',
        templateUrl: 'artist/creating_profile.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        escapeToClose: false
      });
    }

    function prepareFiles(files, type) {
      vm.portfolio[type] = vm.portfolio[type].concat(files);
    }
	}
})();
