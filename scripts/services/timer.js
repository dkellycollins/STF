
angular.module('stf')
    .service('$timer', ['$q', '$interval', function($q, $interval) {
        var time = 0,
            intervalPromise;
        
        function timer(endTime, counter) {
            var deferred = $q.defer();
                
            var p = $interval(function () {
                endTime += counter;
                if(endTime == 0) {
                    deferred.resolve();
                } else {
                    deferred.notify(endTime);
                }
            }, 1000);
            
            deferred.promise.cancel = function() {
                $interval.cancel(p);
                deferred.reject();
            }
            
            return deferred.promise;
        }
        
        return {
            countdown: function(endTime) {
                return timer(endTime, -1);
            },
            start: function() {
                return timer(0, 1);
            }
        }
    }])