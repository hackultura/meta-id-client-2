(function () {
	'use strict';

	angular
		.module('metaidApp')
		.factory('ProposalService', ProposalService);

	ProposalService.$inject = [
		'$http',
		'API_URI_PREFIX',
		'UserService',
		'Upload',
		'PROPOSAL_STATUS'
	];

	function ProposalService($http, API_URI_PREFIX, UserService,
													 Upload, PROPOSAL_STATUS) {
		var proposalSelected = {};
		return {
			query: query,
			queryPaginate: queryPaginate,
			myProposals: myProposals,
			dashboard: dashboard,
			createProposal: createProposal,
			sendProposal: sendProposal,
			approveProposal: approveProposal,
			reproveProposal: reproveProposal,
			getProposal: getProposal,
			getProposalSelected: getProposalSelected,
			setProposalSelected: setProposalSelected,
			updateProposal: updateProposal,
			updateAndSendProposal: updateAndSendProposal,
			deleteProposal: deleteProposal,
			cancelProposal: cancelProposal,
			uploadDocument: uploadDocument,
			isUploadIsProgress: isUploadIsProgress,
			deleteDocument: deleteDocument,
			disableProposal: disableProposal,
			enableProposal: enableProposal,
			isCanceledProposal: isCanceledProposal
		};

		function query() {
			return $http.get(API_URI_PREFIX + '/propostas/');
		}

		function queryPaginate(url) {
			return $http.get(url);
		}

		function myProposals(user_id) {
			return $http.get(API_URI_PREFIX + '/propostas/user/' + user_id + '/');
		}

		function dashboard() {
			return $http.get(API_URI_PREFIX + '/propostas/dashboard/');
		}

		function createProposal(proposal) {
			return $http.post(API_URI_PREFIX + '/propostas/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
					title: proposal.title,
					status: 'draft'
			});
		}

		function sendProposal(proposal) {
			return $http.post(API_URI_PREFIX + '/propostas/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
					title: proposal.title,
					status: 'sended'
			});
		}

		function approveProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: proposal.ente,
					title: proposal.title,
					status: 'approved'
			});
		}

		function reproveProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: proposal.ente,
					title: proposal.title,
					status: 'reproved'
			});
		}

		function getProposal(number) {
			return $http.get(API_URI_PREFIX + '/propostas/' + number + '/');
		}

		function getProposalSelected() {
			return proposalSelected;
		}

		function setProposalSelected(proposal) {
			proposalSelected = proposal;
		}

		function updateProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
					title: proposal.title,
					status: proposal.status || 'draft'
			});
		}

		function updateAndSendProposal(proposal) {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposal.number + '/', {
					ente: UserService.getAuthenticatedAccount().ente.id,
					title: proposal.title,
					status: 'sended'
			});
		}

		function deleteProposal() {
			return $http.delete(API_URI_PREFIX + '/propostas/' + proposalSelected.number + '/');
		}

		function cancelProposal() {
			return $http.put(API_URI_PREFIX + '/propostas/' + proposalSelected.number + '/', {
				ente: UserService.getAuthenticatedAccount().ente.id,
				title: proposalSelected.title,
				status: 'canceled'
			});
		}

		function uploadDocument(proposal, file) {
			return Upload.upload({
				url: API_URI_PREFIX + '/propostas/' + proposal.number + '/upload/',
				data: {file: file}
			});
		}

		function isUploadIsProgress () {
			return Upload.isUploadInProgress();
		}

		function deleteDocument(uid) {
			return $http.delete(API_URI_PREFIX + '/propostas/documentos/' + uid + '/');
		}

		function disableProposal(proposal) {
			return PROPOSAL_STATUS.block_insert.indexOf(proposal.status) !== -1;
		}

		function enableProposal(proposal) {
			return PROPOSAL_STATUS.draft === proposal.status;
		}

		function isCanceledProposal(proposal) {
			return PROPOSAL_STATUS.canceled === proposal.status;
		}
	}
}());
