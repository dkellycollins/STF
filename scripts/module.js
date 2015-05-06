
angular.module('stf', [])
    .service('$three', function() {
        return THREE;
    })
    .service('$math', ['$three', function($three) {
        var math = _.create(Math);
        
        _.assign(math, $three.Math);
        
        return math;
    }]);