var container,
	camera, 
	scene, 
	renderer, 
	audio, 
	board, 
	player, 
	letters = {},
	goldStack,
	assetsToLoad,
	targetWord = "Future",
	levelComplete = 0,
	audio = {},
	gainNode,
	prevDir = 38
	time = 0;

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

		var directionalLight = new THREE.DirectionalLight( 0xffeedd, 0.7 );
		directionalLight.position.set( 5, 5, 5 );
		scene.add(directionalLight);

		directionalLight = directionalLight.clone();
		directionalLight.position.set( 0, 5, 0);	
		scene.add(directionalLight);
	}

	container = $('#container');
	
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.append(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onKeyDown, false);

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
					object.rotateY(getRadians(75));
					letters[letter] = object;
				}
			};
		};
		var assets = [
			{OBJ: 'assets/chessboard/board.obj', MTL: 'assets/chessboard/board.mtl', onLoad: function(object) {
				scene.add(object);
				object.position.y = -0.45;
			}},
			{OBJ: 'assets/mini_box_knight/mini_knight.obj', MTL: 'assets/mini_box_knight/mini_knight.mtl', onLoad: function(object) {
				player.object = object;
				object.rotateY(getRadians(-90));
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
		var audioSources = [];

		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;

				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};

		var onError = function ( xhr ) {
			console.log('Error downloading ' + xhr.currentTarget.responseURL);
		};

		var loadAudio = function() {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			var context = new AudioContext();
			
			gainNode = context.createGain();
			gainNode.connect(context.destination);
			gainNode.gain.value = 0; //Start muted.

			var $audio = $('#bg');
			var bgSource = context.createMediaElementSource($audio[0]);
			bgSource.connect(gainNode);
			audio['bg'] = bgSource;

			var bufferLoader = new BufferLoader(
			    context,
			    audioSources,
			    finishedLoading);

			bufferLoader.load();

			function finishedLoading(bufferList) {
			  audio["bg"] = context.createBufferSource();
			  audio["bg"].buffer = bufferList[0];
			  audio["bg"].connect(gainNode);

			  assetsToLoad -= bufferList.length;
			  if(assetsToLoad == 0) {
			  	onAssetsLoaded();
			  }
			}
		};

		var loadDictionary = function(callback) {
			$.get('assets/dictionary.json', function(response) {
				dictionary = response.words;
				callback();
			});
		}

		THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

		assetsToLoad = assets.length + audioSources.length;
		var loader = new THREE.OBJMTLLoader();
		assets.forEach(function(asset) {
			loader.load(asset.OBJ, asset.MTL, function(object) {
				asset.onLoad(object);
				assetsToLoad--;
				if(assetsToLoad == 0) {
					loadDictionary(onAssetsLoaded);
				}
			}, onProgress, onError);
		});

		loadAudio();
	}

function onAssetsLoaded()  {
	scrambleWord();
	timer();
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
		getRandomWord(function(word) {
			scrambleWord(word);
			levelComplete = 0;
		});
	} else {
		scrambleWord();
		levelComplete = 0;
	}
	
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function onKeyDown(event) {
	if(event.keyCode < 37 || event.keyCode > 40 || levelComplete) {
		return;
	}

	event.preventDefault();

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
		player.object.rotateY(getRotation(prevDir, event.keyCode));
		prevDir = event.keyCode;	
	}
}

function getRotation(prevDir, dir) {
	var rotations = {
		37: { //Left
			37: 0, //Left
			38: getRadians(-90), //Up
			39: getRadians(180), //Right
			40: getRadians(90) //Down
		},
		38: { //Up
			37: getRadians(90), //Left
			38: 0, //Up
			39: getRadians(-90), //Right
			40: getRadians(180) //Down
		},
		39: { //Right
			37: getRadians(180), //Left
			38: getRadians(90), //Up
			39: 0, //Right
			40: getRadians(-90) //Down
		},
		40: { //Down
			37: getRadians(-90), //Left
			38: getRadians(180), //Up
			39: getRadians(90), //Right
			40: 0 //Down
		}
	}

	return rotations[prevDir][dir];
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

	targetWord = word;
	time = 0;
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
	if(levelComplete) {
		return;
	}

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

	check();
}

function render() {
	renderer.render(scene, camera);

	var $moveCount = $('.moveCount');
	$moveCount.text(player.moveCount);

	var $points = $('.points');
	$points.text(time);

	var $word = $('.word');
	$word.text(player.word);

	var $correct = $('.correct');
	var $incorrect = $('.incorrect');
	switch(levelComplete) {
		case 2: $incorrect.show(); break;
		case 1: $correct.show(); break;
		default: $incorrect.hide(); $correct.hide(); break;
	}
}

function check() {
	if(!player.word) {
		levelComplete = 0;
	} else if(targetWord.indexOf(player.word) != 0) {
		levelComplete = 2; //Complete, failed;
	} else if(targetWord.length == player.word.length) {
		levelComplete = 1; //Complete, success;
	} else {
		levelComplete = 0;
	}
}

function mute() {
	gainNode.gain.value = !gainNode.gain.value;

	var $mute = $('.mute');
	$mute.toggle();
}

function getRandomWord(callback) {
	var index = Math.floor((Math.random() * 100) + 1) - 1;
	var word = dictionary[index];

	return word.word;

	/* Wordnik does not support https
	var url = 'https://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=10000&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=5&maxLength=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
	$.get(url, function(response) {
		callback(response.word);
	});
	*/
}

function getRadians(degress) {
	return degress * (Math.PI / 180);
}

function timer() {
	setInterval(function() {
		if(levelComplete) {
			return;
		}

		time++;
	}, 1000);
}
