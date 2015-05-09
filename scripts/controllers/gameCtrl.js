
angular.module('stf')
    .controller('GameCtrl', ['$scope', '$assetManager', '$player', '$board', '$three', '$math', function($scope, $assetManager, $player, $board, $three, $math) {
        
        var origin = new $three.Vector3(),
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
    		
    		var chessboard = $assetManager.get('board');
    		       
	        $scope.scene.add(chessboard);
		    chessboard.position.y = -0.45;
	       
	        $player.object = $assetManager.get('mini_knight');
		    $player.object.rotateY($math.degToRad(-90));
		    $scope.scene.add($player.object);
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
        			38: $math.degToRad(-90), //Up
        			39: $math.degToRad(180), //Right
        			40: $math.degToRad(90) //Down
        		},
        		38: { //Up
        			37: $math.degToRad(90), //Left
        			38: 0, //Up
        			39: $math.degToRad(-90), //Right
        			40: $math.degToRad(180) //Down
        		},
        		39: { //Right
        			37: $math.degToRad(180), //Left
        			38: $math.degToRad(90), //Up
        			39: 0, //Right
        			40: $math.degToRad(-90) //Down
        		},
        		40: { //Down
        			37: $math.degToRad(-90), //Left
        			38: $math.degToRad(180), //Up
        			39: $math.degToRad(90), //Right
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
        	$player.x = $math.clamp($player.x, 0, 7);
        	$player.y = $math.clamp($player.y, 0, 7);
        
        	if(prevY != $player.y || prevX != $player.x) {
        		$player.moveCount++;
        		$player.object.rotateY(getRotation(prevDir, $event.keyCode));
        		prevDir = event.keyCode;	
        	}
        }
        
        $scope.onKeyUp = _.debounce(onKeyUp, 500);
        
        initScene();
    }]);