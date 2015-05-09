
angular.module('stf', [
    'ui.router',
    'ui.bootstrap'
]).service('$three', function() {
    return THREE;
}).service('$math', ['$three', function($three) {
    var math = _.create(Math);
    
    _.assign(math, $three.Math);
    
    return math;
}]);