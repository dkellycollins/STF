
angular.module('stf')
    .service('$timer', ['$interval', function($interval) {
        var time = 0;
        var promise;
        
        function tick() {
            time++;
        }
        
        return {
            start: function() {
                if(!promise) {
                    promise = $interval(tick, 1000);    
                }
            },
            stop: function() {
                if(!!promise) {
                    $interval.cancel(promise);
                    promise = null;
                }
            }
            reset: function() {
                time = 0;
            }
            getTime: function() {
                return time;
            }
        }
    }])