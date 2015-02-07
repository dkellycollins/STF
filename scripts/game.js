var container, stats;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var origin = new THREE.Vector3();


init();
animate();


function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.x = 10;
	camera.position.y = 12;
	camera.lookAt(origin);

	// scene
	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 1, 1 ).normalize();
	scene.add( directionalLight );

	// load models
	loadAssets();

	window.addEventListener( 'resize', onWindowResize, false );
}

function loadAssets() {
	var assets = [
		{OBJ: 'assets/chessboard/board.obj', MTL: 'assets/chessboard/board.mtl' }
	];
	
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};
	
	var onLoad = function(object) {
		scene.add(object);
	}

	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

	var loader = new THREE.OBJMTLLoader();
	assets.forEach(function(asset) {
		loader.load(asset.OBJ, asset.MTL, onLoad, onProgress, onError);
	});
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {
/*
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
*/
}

//

function animate() {
	requestAnimationFrame( animate );
	update();
	render();
}

function update() {

}

function render() {
	renderer.render( scene, camera );
}


