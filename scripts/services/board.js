
angular.module('stf')
    .service('$board', ['$three', function($three) {
        
        var board;
        
        function initGameBoard() {
    		var x = 3.5,
    			z = 3,
    			padding = 0.22,
    			width = 0.5;
    
    		board = [];
    		for(var i = 0; i < 8; i++) {
    			board[i] = [];
    			for(var j = 0; j < 8; j++) {
    				board[i][j] = {
    					position: new $three.Vector3(
    						(x + padding) - (j * (2 * padding + width)),
    						0,
    						(z + padding) - (i * (2 * padding + width)))
    				}
    			}
    		}
    	}
    	
    	initGameBoard();
    	
    	return {
    	    getPosition: function(x, y) {
    	        return board[x][y].position;
    	    },
    	    getItem: function(x, y) {
    	        return board[x][y].item;
    	    },
    	    setItem: function(x, y, item) {
    	        board[x][y].item = item;
    	    },
    	    getRandomEmptyLocation: function {
    	        
    	    },
    	    reset: function() {
    	        initGameBoard();
    	    }
    	}
        
    }]);