
angular.module('stf')
    .service('assetManager', ['$q', function($q) {
        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        
        return {
            loadModels: (assets) {
                var loader = new THREE.OBJMTLLoader();
                var promises = _.map(assets, function(asset) {
                    var promise = $q.defer();
                    loader.load(asset.OBJ, asset.MTL, 
                        function(object) {
                            promise.resolve();
                        },
                        function(xhr) {
                            if ( xhr.lengthComputable ) {
                				var percentComplete = xhr.loaded / xhr.total * 100;
                				promise.notify(percentComplete);
                			}
                        },
                        function(error) {
                            promise.reject(error);
                        });
                    return promise.promise;    
                });
                
                return $q.all(promises);
            }
        }
    })