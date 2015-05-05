
angular.module('stf')
    .controller('GameCtrl', ['$scope', function($scope) {
        
        function initScene() {
    		var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    		camera.position.x = 10;
    		camera.position.y = 12;
    		camera.lookAt(origin);
    		
    		$scope.camera = camera;
    
    		// scene
    		var scene = new THREE.Scene();
    
    		var directionalLight = new THREE.DirectionalLight( 0xffeedd, 0.7 );
    		directionalLight.position.set( 5, 5, 5 );
    		scene.add(directionalLight);
    
    		directionalLight = directionalLight.clone();
    		directionalLight.position.set( 0, 5, 0);	
    		scene.add(directionalLight);
    		
    		$scope.scene = scene;
    	}
        
    }]);