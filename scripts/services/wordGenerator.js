
angular.module('stf')
    .service('$wordGenerator', ['$q', '$wordnikService', function($q, $wordnikService) {
        
        return {
            getNewWord: function() {
                return $wordnikService.getRandomWord();
            }
        }
    }]);