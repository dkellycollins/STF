
angular.module('stf')
    .controller('LoadingCtrl', ['$scope', '$assetManager', '$state', function($scope, $assetManger, $state) {
        var assets = [
            {Name: 'board', OBJ: 'assets/chessboard/board.obj', MTL: 'assets/chessboard/board.mtl'},
    		{Name: 'mini_knight', OBJ: 'assets/mini_box_knight/mini_knight.obj', MTL: 'assets/mini_box_knight/mini_knight.mtl'}
        ];
        
        var letterAsset = function(letter) {
			return {
			    Name: letter,
				OBJ: 'assets/alphabet/' + letter + '.obj',
				MTL: 'assets/alphabet/' + letter + '.mtl'
			};
		};
		
		assets.concat(_.map('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), letterAsset));
        
        $assetManger.loadAssets(assets)
            .then(function() {
                $state.go('game');
            }, function() {
                //TODO handle error.
            }, function(progress) {
                $scope.progress = progress;
            });
    }]);