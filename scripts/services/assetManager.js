
angular.module('stf')
    .service('$assetManager', ['$q', '$three', function($q, $three) {
        $three.Loader.Handlers.add( /\.dds$/i, new $three.DDSLoader() );
        
        return {
            loadAssets: function(assets) {
                var loader = new $three.OBJMTLLoader();
                var promises = _.map(assets, function(asset) {
                    var promise = $q.defer();
                    loader.load(asset.OBJ, asset.MTL, 
                        function(object) {
                            promise.resolve(object);
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
    }]);