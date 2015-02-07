var container;

var camera, scene, renderer, audio, board, player;

var mouseX = 0, mouseY = 0;

var loadProgress = {};

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var origin = new THREE.Vector3();


initGame();
animate();

function initGame() {
	var loadAssets = function() {
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
				object.rotation.y = 45;
				player.object = object;
				scene.add(object);
			}}
			/*{OBJ: 'assets/alphabet/A.obj', MTL: 'assets/alphabet/A.mtl', onLoad: function(object) {
				var x = THREE.Math.randInt(0, 7);
				var y = THREE.Math.randInt(0, 7);
				object.rotateY(45);
				object.position.copy(board[x][y].position);
				scene.add(object);
			}},*/
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

		var loader = new THREE.OBJMTLLoader();
		assets.forEach(function(asset) {
			loader.load(asset.OBJ, asset.MTL, asset.onLoad, onProgress, onError);
		});
	}

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
	loadAssets();
}

function resetPlayer() {
	player = {
		x:0,
		y:0,
		object: (!!player) ? player.object : null,
		moveCount: 0
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

//

function animate(time) {
	requestAnimationFrame(animate);
	update();
	render();
}

function update() {
	if(!!player.object) {
		player.object.position.copy(board[player.x][player.y].position);
	}

	
}

function render() {
	renderer.render(scene, camera);

	var $moveCount = $('.moveCount');
	$moveCount.text(player.moveCount);
}


