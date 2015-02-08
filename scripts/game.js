var container,
	camera,
	baseScene, 
	scene, 
	renderer, 
	audio, 
	board, 
	player, 
	letters = {},
	goldStack,
	assetsToLoad,
	targetWord = "Future";

var words = [
	"Lorem",
	"Ipsum",
	"simply",
	"dummy",
	"text",
	"printing",
	"typesetting",
	"industry",
	"abcdefghijklmnopqrstuvwxyz"
];

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var origin = new THREE.Vector3();

initGame();
loadAssets();

function initGame() {
	var initGameBoard = function() {
		var x = 3.5,
			z = 3,
			padding = 0.22,
			width = 0.5;

		board = [];
		for(var i = 0; i < 8; i++) {
			board[i] = [];
			for(var j = 0; j < 8; j++) {
				board[i][j] = {
					position: new THREE.Vector3(
						(x + padding) - (j * (2 * padding + width)),
						0,
						(z + padding) - (i * (2 * padding + width)))
				}
			}
		}
	}

	function initScene() {
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.x = 10;
		camera.position.y = 12;
		camera.lookAt(origin);

		// scene
		scene = new THREE.Scene();

		/*var ambient = new THREE.AmbientLight( 0x404040 );
		scene.add(ambient);*/

		var directionalLight = new THREE.DirectionalLight( 0xffeedd );
		directionalLight.position.set( 0, 1, 1 ).normalize();
		scene.add(directionalLight);
		
		directionalLight = directionalLight.clone();
		directionalLight.position.set( 0, -1, -1 ).normalize();	
		scene.add(directionalLight);

		directionalLight = directionalLight.clone();
		directionalLight.position.set( 0, -1, 0).normalize();	
		scene.add(directionalLight);

		directionalLight = directionalLight.clone();
		directionalLight.position.set( 0, 1, 0).normalize();	
		scene.add(directionalLight);
	}

	container = $('#container');
	
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.append(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keyup', onKeyUp, false);

	initGameBoard();
	resetPlayer();
	initScene();	
}

function loadAssets() {
		var letterAsset = function(letter) {
			return {
				OBJ: 'assets/alphabet/' + letter + '.obj',
				MTL: 'assets/alphabet/' + letter + '.mtl',
				onLoad: function(object) {
					object.rotateY(45);
					letters[letter] = object;
				}
			};
		};
		var assets = [
			{OBJ: 'assets/chessboard/board.obj', MTL: 'assets/chessboard/board.mtl', onLoad: function(object) {
				scene.add(object);
				object.position.y = -0.45;
			}},
			/*{OBJ: 'assets/test_cube/test_cube.obj', MTL: 'assets/test_cube/test_cube.mtl', onLoad: function(object) {
				board.forEach(function(row) {
					row.forEach(function(square) {
						var clone = object.clone();
						clone.position.copy(square.position);
						scene.add(clone);
					});
				});
			}},*/
			{OBJ: 'assets/mini_box_knight/mini_knight.obj', MTL: 'assets/mini_box_knight/mini_knight.mtl', onLoad: function(object) {
				object.rotateY(45);
				player.object = object;
				scene.add(object);
			}},
			letterAsset('A'),
			letterAsset('B'),
			letterAsset('C'),
			letterAsset('D'),
			letterAsset('E'),
			letterAsset('F'),
			letterAsset('G'),
			letterAsset('H'),
			letterAsset('I'),
			letterAsset('J'),
			letterAsset('K'),
			letterAsset('L'),
			letterAsset('M'),
			letterAsset('N'),
			letterAsset('O'),
			letterAsset('P'),
			letterAsset('Q'),
			letterAsset('R'),
			letterAsset('S'),
			letterAsset('T'),
			letterAsset('U'),
			letterAsset('V'),
			letterAsset('W'),
			letterAsset('X'),
			letterAsset('Y'),
			letterAsset('Z'),
		];

		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;

				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};

		var onError = function ( xhr ) {
			console.log('Error downloading ' + xhr.currentTarget.responseURL);
		};

		THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

		assetsToLoad = assets.length;
		var loader = new THREE.OBJMTLLoader();
		assets.forEach(function(asset) {
			loader.load(asset.OBJ, asset.MTL, function(object) {
				asset.onLoad(object);
				assetsToLoad--;
				if(assetsToLoad == 0) {
					onAssetsLoaded();
				}
			}, onProgress, onError);
		});
	}

function onAssetsLoaded()  {
	baseScene = scene.clone();

	scrambleWord();
	animate();
}

function resetPlayer() {
	player = {
		x:0,
		y:0,
		object: (!!player) ? player.object : null,
		moveCount: 0,
		points: 0,
		word: ""
	}
}

function reset(getNewWord) {
	//Reset the objects in the scene.
	//scene = baseScene.clone();

	//Reset board data
	board.forEach(function(row) {
		row.forEach(function (square) {
			if(!!square.item) {
				scene.remove(square.item.object);
				square.item = null;
			}
		});
	});

	resetPlayer();
	if(getNewWord) {
		scrambleWord(words.shift());
	} else {
		scrambleWord();
	}
	
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onKeyUp(event) {
	if(event.keyCode < 37 || event.keyCode > 40) {
		return;
	}

	var prevX = player.x;
	var prevY = player.y;
	switch(event.keyCode) {
		case 37: player.x -= 1; break; //Left
		case 38: player.y += 1; break; //Up
		case 39: player.x += 1; break; //Right
		case 40: player.y -= 1; break; //Down
	}
	player.x = THREE.Math.clamp(player.x, 0, 7);
	player.y = THREE.Math.clamp(player.y, 0, 7);

	if(prevY != player.y || prevX != player.x) {
		player.moveCount++;	
	}
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
		scene.add(item);
	}

	//Add gold in a random location
	/*var loc = getRandomEmptyLocation();
	board[loc.x][loc.y].item = {
		points: 500,
		object: goldStack
	};
	scene.add(goldStack);*/

	targetWord = word;
}

function getRandomEmptyLocation() {
	var x, y;
	do {
		x = THREE.Math.randInt(0, 7);
		y = THREE.Math.randInt(0, 7);
	} while(!!board[x][y].item || (player.x == x && player.y == y));

	return {
		x: x,
		y: y
	};
}

function animate(time) {
	requestAnimationFrame(animate);
	update();
	render();
}

function update() {
	if(!!player.object) {
		player.object.position.copy(board[player.x][player.y].position);
	}

	var item = board[player.x][player.y].item;
	if(!!item) {
		if(!!item.letter) {
			player.word += item.letter;
		}

		player.points += item.points;
		scene.remove(item.object);

		board[player.x][player.y].item = null;
	}
}

function render() {
	renderer.render(scene, camera);

	var $moveCount = $('.moveCount');
	$moveCount.text(player.moveCount);

	var $points = $('.points');
	$points.text(player.points);

	var $word = $('.word');
	$word.text(player.word);

	var $correct = $('.correct');
	var $incorrect = $('.incorrect');
	if(player.word.length == targetWord.length) {
		//Player collected all the letters.
		var correct = player.word == targetWord;
		if(correct) {
			$correct.show();
		} else {
			$incorrect.show();
		}
	} else {
		$correct.hide();
		$incorrect.hide();
	}
}


