
angular.module('stf')
    .controller('GameCtrl', ['$scope', '$assetManager', '$player', '$board', '$three', '$math', function($scope, $assetManager, $player, $board, $three, $math) {
        
        var letters,
            origin = new $three.Vector3(),
            targetWord,
            prevDir;
        
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
    		       
    		       $player.object = knight;
    			   knight.rotateY(getRadians(-90));
    			   $scope.scene.add(knight);
    			   
    			   var la = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    			   
    			   letters = [];
    			   while(la.length > 0) {
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
        		var loc = $board.getRandomEmptyLocation();
        
        		var item = letters[letter].clone();
        		$board.setItem(loc.x, loc.y, {
        			letter: letter,
        			points: 100,
        			object: item
        		});
        		item.position.copy($board.getPosition(loc.x, loc.y));
        		$scope.scene.add(item);
        	}
        
        	targetWord = word;
        }
        
        function getRotation(prevDir, dir) {
        	var rotations = {
        		37: { //Left
        			37: 0, //Left
        			38: $three.Math.degToRad(-90), //Up
        			39: $three.Math.degToRad(180), //Right
        			40: $three.Math.degToRad(90) //Down
        		},
        		38: { //Up
        			37: $three.Math.degToRad(90), //Left
        			38: 0, //Up
        			39: $three.Math.degToRad(-90), //Right
        			40: $three.Math.degToRad(180) //Down
        		},
        		39: { //Right
        			37: $three.Math.degToRad(180), //Left
        			38: $three.Math.degToRad(90), //Up
        			39: 0, //Right
        			40: $three.Math.degToRad(-90) //Down
        		},
        		40: { //Down
        			37: $three.Math.degToRad(-90), //Left
        			38: $three.Math.degToRad(180), //Up
        			39: $three.Math.degToRad(90), //Right
        			40: 0 //Down
        		}
        	}
        
        	return rotations[prevDir][dir];
        }
        
        function onKeyUp($event) {
            if(event.keyCode < 37 || event.keyCode > 40) {
        		return;
        	}
        
        	$event.preventDefault();
        
        	var prevX = $player.x;
        	var prevY = $player.y;
        	switch(event.keyCode) {
        		case 37: $player.x -= 1; break; //Left
        		case 38: $player.y += 1; break; //Up
        		case 39: $player.x += 1; break; //Right
        		case 40: $player.y -= 1; break; //Down
        	}
        	$player.x = $three.Math.clamp($player.x, 0, 7);
        	$player.y = $three.Math.clamp($player.y, 0, 7);
        
        	if(prevY != $player.y || prevX != $player.x) {
        		$player.moveCount++;
        		$player.object.rotateY(getRotation(prevDir, $event.keyCode));
        		prevDir = event.keyCode;	
        	}
        }
        
        $scope.onKeyUp = _.debounce(onKeyUp, 500);
        
        initScene();
        loadAssets();
    }]);