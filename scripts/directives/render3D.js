
angular.module('stf')
    .directive('render3D', ['$window', function($window) {
        return {
            restrict: 'EA',
            scope: {
                getScene: '&scene',
                getCamera: '&camera'
            },
            link: function($scope, $element) {
                var renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                
                function onWindowResize() {
                    renderer.setSize( window.innerWidth, window.innerHeight );
                }
                onWindowResize();
                
                $window.addEventListener('resize', onWindowResize, false);
                
                $element.append(renderer.domElement);
                
                function animate() {
                    var scene = $scope.getScene();
                    var camera = $scope.getCamera();
                    
                    if(!!scene && !!camera) {
                        renderer.render(scene, camera);    
                    }
                    
                    $window.requestAnimationFrame(animate);
                }
                animate();
            }
        }
    })