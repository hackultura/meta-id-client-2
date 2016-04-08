(function () {
	'use strict';

	angular
		.module('metaidApp')
		.config(appConfig)
		.run(runConfig);


	appConfig.$inject = [
		'$httpProvider',
		'$stateProvider',
		'$urlRouterProvider',
		'$mdThemingProvider',
		'$mdGestureProvider',
		'cfpLoadingBarProvider'
	];

	runConfig.$inject = [
		'$rootScope',
		'$state',
		'$http',
		'$cookies',
		'UserService',
		'ProposalService',
		'PROPOSAL_LIMIT'
	];

	function appConfig($httpProvider, $stateProvider, $urlRouterProvider,
										 $mdThemingProvider, $mdGestureProvider,
										 cfpLoadingBarProvider) {

		// Hijack click to mobile
		$mdGestureProvider.skipClickHijack();

		// Define CSRF
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

		// Customize loading
		cfpLoadingBarProvider.includeSpinner = true;
		cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar"></div></div>';

		// Define default router
		$urlRouterProvider.otherwise('/login');

		// Router templates base
		$stateProvider
			.state('admin', {
				abstract: true,
				views: {
					'@': {
						templateUrl: 'pages/layouts/admin.html'
					},
					'header@admin': {
						templateUrl: 'pages/header.html',
						controller: 'HeaderController',
						controllerAs: 'vm'
					},
					'sidenav@admin': {
						templateUrl: 'pages/sidenav.html',
						controller: 'SidenavController',
						controllerAs: 'vm'
					},
					'main@admin':  {templateUrl: 'pages/main.html'}
				},
				data: {
					pageClasses: ''
				}
			})
			.state('simple', {
				abstract: true,
				views: {
					'@': {
						templateUrl: 'pages/layouts/simple.html'
					},
					'main@simple':  {templateUrl: 'pages/main.html'}
				},
				data: {
					pageClasses: ''
				}
			});

			// Routes of system
			$stateProvider.state('admin.minha_situacao', {
				parent: 'admin',
				url: '/artista/painel',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'artist/dashboard.html'
					}
				},
				data: {
					title: 'Minha Situação'
				}
			})
			.state('admin.perfis', {
				parent: 'admin',
				url: '/artista/perfis',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'artist/profiles.html'
					}
				},
				data: {
					title: 'Meus Perfis'
				}
			})
			.state('admin.perfis.novo', {
				parent: 'admin',
				url: '/artista/perfis/novo',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'artist/profile_new.html'
					}
				},
				data: {
					title: 'Meus Perfis'
				}
			})
			.state('admin.propostas.novo', {
				parent: 'admin',
				url: '/propostas/novo',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_new.html'
					}
				},
				data: {
					title: 'Nova Proposta'
				}
			})
			.state('admin.propostas.novo', {
				parent: 'admin',
				url: '/propostas/novo',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_new.html'
					}
				},
				data: {
					title: 'Nova Proposta'
				}
			})
			.state('admin.propostas.detalhes', {
				parent: 'admin',
				url: '/propostas/detalhes',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_receipt.html'
					}
				},
				data: {
					title: 'Informações da Proposta'
				}
			})
			.state('admin.propostas.detalhe_impressao', {
				parent: 'admin',
				url: '/proposta/:number/comprovante',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_receipt_print.html'
					}
				},
				data: {
						title: 'Comprovante da Proposta - Visualização para Impressão',
						wrapperClasses: 'wrapper',
						pageClasses: 'print_wrapper page_a4_wrapper print_view'
				}
			})
			.state('admin.propostas.editar', {
				parent: 'admin',
				url: '/propostas/atualizar/:number',
				authenticate: true,
				admin: false,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_update.html'
					}
				},
				data: {
					title: 'Atualizar Proposta'
				}
			})
			.state('admin.propostas.painel', {
				parent: 'admin',
				url: '/propostas/painel',
				authenticate: true,
				admin: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/dashboard.html'
					}
				},
				data: {
					title: 'Painel de Controle'
				}
			})
			.state('admin.propostas.analise', {
				parent: 'admin',
				url: '/propostas/analise',
				authenticate: true,
				admin: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_analysis.html'
					}
				},
				data: {
					title: 'Propostas Enviadas'
				}
			})
			.state('admin.propostas.analise.detalhe', {
				parent: 'admin',
				url: '/propostas/analise/:number',
				authenticate: true,
				admin: true,
				views: {
					'content@admin': {
						templateUrl: 'proposal/proposal_detail.html'
					}
				},
				data: {
					title: 'Detalhe da Proposta'
				}
			})
			.state('admin.artistas', {
				parent: 'admin',
				url: '/propostas/artistas',
				authenticate: true,
				admin: true,
				views: {
					'content@admin': {
						templateUrl: 'artist/artist_list.html'
					}
				},
				data: {
					title: 'Lista de Artistas'
				}
			})
			.state('admin.usuarios', {
				parent: 'admin',
				authenticate: true,
				admin: true,
				url: '/usuarios',
				views: {
					'content@admin': {
						templateUrl: 'user/user_list.html'
					}
				},
				data: {
					title: 'Usuários'
				}
			})
			.state('admin.usuarios.novo', {
				parent: 'admin',
				authenticate: true,
				admin: true,
				url: '/usuarios/novo',
				views: {
					'content@admin': {
						templateUrl: 'user/register.html'
					}
				},
				data: {
					title: 'Registro'
				}
			})
			.state('admin.usuarios.editar', {
				parent: 'admin',
				authenticate: true,
				admin: true,
				url: '/usuarios/:id/atualizar',
				views: {
					'content@admin': {
						templateUrl: 'user/user_update.html'
					}
				}
			})
			.state('admin.perfil', {
				parent: 'admin',
				authenticate: true,
				admin: false,
				url: '/usuarios/:id/perfil',
				views: {
					'content@admin': {
						templateUrl: 'user/user_profile.html'
					}
				},
				data: {
					title: 'Perfil do Usuário'
				}
			})
			.state('admin.change_password', {
				parent: 'admin',
				authenticate: true,
				admin: false,
				url: '/usuarios/:id/senha/alterar',
				views: {
					'content@admin': {
						templateUrl: 'user/user_changepassword.html'
					}
				},
				data: {
					title: 'Perfil do Usuário'
				}
			})
			.state('simple.register', {
				parent: 'simple',
				url: '/registro',
				authenticate: false,
				admin: false,
				views: {
					'content@simple': {
						templateUrl: 'user/register.html'
					}
				},
				data: {
					title: 'Registro'
				}
			})
			.state('simple.login', {
				parent: 'simple',
				url: '/login',
				authenticate: false,
				admin: false,
				views: {
					'content@simple': {
						templateUrl: 'user/login.html'
					}
				},
				data: {
						title: 'Login de Acesso',
						pageClasses: 'login',
						documentClasses: 'login login_bg'
				}
			});

			var gdfPrimaryPalette = $mdThemingProvider.extendPalette('green', {
				'500': '008e4b',
				'contrastDefaultColor': 'light'
			});
			$mdThemingProvider.definePalette('gdf_primary', gdfPrimaryPalette);

			var gdfAccentPalette = $mdThemingProvider.extendPalette('blue', {
				'500': '34659A',
				'A200': '3F79BB'
			});
			$mdThemingProvider.definePalette('gdf_accent', gdfAccentPalette);

			$mdThemingProvider.theme('default')
			.primaryPalette('gdf_primary')
			.accentPalette('gdf_accent')
			.warnPalette('red');
		}

		function runConfig($rootScope, $state, $http, $cookies, UserService) {
			// Config CSRF Token
			$http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');

			// Verify if user is authenticated
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
				if(toState.authenticate && !UserService.isAuthenticated()) {
					$state.nextState = {};
					$state.nextState.name = toState.name;
					$state.nextState.params = toParams;

					$state.transitionTo('simple.login');
					event.preventDefault();
				}

				if(toState.admin && !UserService.isAdmin()) {
					$state.transitionTo('admin.propostas');
					event.preventDefault();
				}

			});

			// Assign values to $rootScope made in data on router states
			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				$state.previous = {};
				$state.previous.name = fromState.name;
				$state.previous.params = fromParams;

				$rootScope.title = toState.data.title;
				$rootScope.pageClasses = toState.data.pageClasses;
				$rootScope.wrapperClasses = toState.data.wrapperClasses;
				$rootScope.documentClasses = toState.data.documentClasses;
			});

			$rootScope.back = function() {
				$state.go($state.previous.name, $state.previous.params);
			};
		}
}());
