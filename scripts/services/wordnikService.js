
angular.module('stf')
    .service('$wordnikService', ['$http', function($http, $wordnikApiKey) {
        
        function getRandomWordUrl(params) {
            return 'http://api.wordnik.com:80/v4/words.json/randomWord'
            + '?hasDictionaryDef=' + params.hasDictionaryDef
            + '&minCorpusCount=' + params.minCorpusCount
            + '&maxCorpusCount=' + params.maxCorpusCount
            + '&minDictionaryCount=' + params.minDictionaryCount
            + '&maxDictionaryCount=' + params.maxDictionaryCount
            + '&minLength=' + params.minLength
            + '&maxLength=' + params.maxLength
            + '&api_key=' + $wordnikApiKey;
            
        } 
        
        return {
            getRandomWord: function(params) {
                return $http.get(getRandomWordUrl(params));
            }
        }
    }]);