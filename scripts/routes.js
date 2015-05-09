
angular.module('stf')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        
        $stateProvider
            .state('index', {
                url: '/',
                controller: ['$assetManager', '$state', function($assetManager, $state) {
                    $state.go('loading');
                }]
            })
            .state('loading', {
                url: '/loading',
                templateUrl: 'scripts/templates/loading.html',
                controller: 'LoadingCtrl'
            })
            .state('game', {
                url: '/game',
                templateUrl: 'scripts/templates/game.html',
                controller: 'GameCtrl'
            });
    }]);