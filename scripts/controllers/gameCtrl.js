
angular.module('stf')
    .controller('GameCtrl', ['$scope', '$assetManager', '$three', '$lodash', function($scope, $assetManager, $three, _) {
        
        var board,
            letters,
            player,
            origin = new $three.Vector3(),
            targetWord;
        
        function initGameBoard() {
    		var x = 3.5,
    			z = 3,
    			padding = 0.22,
    			width = 0.5;
    
    		board = [];
    		for(var i = 0; i < 8; i++) {
    			board[i] = [];
    			for(var j = 0; j < 8; j++) {
    				board[i][j] = {
    					position: new $three.Vector3(
    						(x + padding) - (j * (2 * padding + width)),
    						0,
    						(z + padding) - (i * (2 * padding + width)))
    				}
    			}
    		}
    	}
        
        function initScene() {
    		var camera = new $three.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    		camera.position.x = 10;
    		camera.position.y = 12;
    		camera.lookAt(origin);
    		
    		$scope.camera = camera;
    
    		// scene
    		var scene = new $three.Scene();
    
    		var directionalLight = new $three.DirectionalLight( 0xffeedd, 0.7 );
    		directionalLight.position.set( 5, 5, 5 );
    		scene.add(directionalLight);
    
    		directionalLight = directionalLight.clone();
    		directionalLight.position.set( 0, 5, 0);	
    		scene.add(directionalLight);
    		
    		$scope.scene = scene;
    	}
    	
    	function loadAssets() {
    	    
    		var assets = [
    			{OBJ: 'assets/chessboard/board.obj', MTL: 'assets/chessboard/board.mtl'},
    			{OBJ: 'assets/mini_box_knight/mini_knight.obj', MTL: 'assets/mini_box_knight/mini_knight.mtl'},
    		];
    		
    		var letterAsset = function(letter) {
    			return {
    				OBJ: 'assets/alphabet/' + letter + '.obj',
    				MTL: 'assets/alphabet/' + letter + '.mtl'
    			};
    		};
    		
    		assets.concat(_.map('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), letterAsset));
    		
    		$assetManager.loadAssets(assets)
    		    .then(function(objects) {
    		       var chessboard = objects.pop();
    		       
    		       $scope.scene.add(chessboard);
    			   chessboard.position.y = -0.45;
    		       
    		       var knight = objects.pop();
    		       
    		       player.object = knight;
    			   knight.rotateY(getRadians(-90));
    			   $scope.scene.add(knight);
    			   
    			   var la = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    			   
    			   letters = [];
    			   while(l.length > 0) {
    			       var object = objects.pop();
    			       var l = la.pop();
    			       
    			       letters[l] = object;
    			   }
    		    });
    	}
    	
    	function scrambleWord(word) {
        	word = word || targetWord;
        	word = word.toUpperCase();
        
        	Math.seedrandom(word);
        
        	for(var i = 0; i < word.length; i++) {
        		//Get empty random position.
        		var letter = word.charAt(i);
        		var loc = getRandomEmptyLocation();
        
        		var item = letters[letter].clone();
        		board[loc.x][loc.y].item = {
        			letter: letter,
        			points: 100,
        			object: item
        		};
        		item.position.copy(board[loc.x][loc.y].position);
        		$scope.scene.add(item);
        	}
        
        	targetWord = word;
        }
        
        function getRandomEmptyLocation() {
        	var x, y;
        	do {
        		x = $three.Math.randInt(0, 7);
        		y = $three.Math.randInt(0, 7);
        	} while(!!board[x][y].item || (player.x == x && player.y == y));
        
        	return {
        		x: x,
        		y: y
        	};
        }
        
    }]);