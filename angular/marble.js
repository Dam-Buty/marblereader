(function () { 
angular.module("player", ['youtube-embed', "ngAnimate", "duScroll"])
.controller("PlayerController", 
[ "$window", "$scope", "$http", "$timeout", "$animate", 
function($window, $scope, $http, $timeout, $animate) {
    
    // Paramètres de lecture
    $scope.params = {
        story: "marble-hornets",
        tick: 2000,
        handle: undefined,
        cinema: document.getElementById("player"),
        loaded: false,
        
        autoPlay: false,
        fullScreen: false,
        
	    stopPlay: function() {
		    this.autoPlay = !this.autoPlay;
		    if (this.autoPlay && $scope.current.get().type != 2) {
		        $scope.current.next();
		    }
	    }
    };
    
	// Données de l'histoire
    $scope.story = {
        title: "",
        min: 0,
        max: 0,  
        accounts: [],
        seasons: []
    };
	
	// Données du chapitre en cours
	$scope.current = {
	    season: 0,
	    day: 0,
	    chapter: 0,
	    
	    // Helpers
	    get: function() {
	        if (this.season != -1) {
	            var day = $scope.story.seasons[this.season][this.day];
	            var chapter = day.chapters[this.chapter];
	            
	            chapter["date"] = day.date;
	            
	            return chapter;
	        } else {
	            return { };
	        }
	    },
	    set: function(day, chapter) {
	        this.day = day;
	        this.chapter = chapter;
	        
	        var currentChapter = this.get();
		
	        if (currentChapter.category != "media" && $scope.params.autoPlay) {
	            $scope.params.handle = $timeout(function() {
	                if ($scope.params.autoPlay) {
		                $scope.current.next();
	                }
	            }, $scope.params.tick);
	        } 
	    },
	    is: function(day, chapter) {
	        return (this.day == day && this.chapter == chapter);
	    },
	    displayed: function() {
	        var first = Math.max(this.day - 3, 0);
	        var displayed = [];
	        
	        for(var i = first;i < first + 3;i++) {
	            displayed.push($scope.story.seasons[this.season][i]);
	        }
	        
	        return displayed;
	    },	    
	    isTwitter: function() {
	        return (this.get().type == 1);
	    },	    
	    isYoutube: function() {
	        return (this.get().type == 2);
	    },
	    
	    // Navigation
	    prev: function() {
	        var day = this.day;
	        var chapter = this.chapter;
	        	        
		    if (chapter > 0) {
			    chapter--;	
		    } else {
			    if (day > 0) {
				    day--;
				    chapter = $scope.story.seasons[this.season][day].chapters.length - 1;
			    }		
		    }
		    
		    this.set(day, chapter);	
	    },
	    next: function() {
	        var day = this.day;
	        var chapter = this.chapter;
	        
		    if (chapter < $scope.story.seasons[this.season][day].chapters.length - 1) {
			    chapter++;	
		    } else {
			    if (day <$scope.story.seasons[this.season].length - 1) {
				    day++;
				    chapter = 0;	
			    }		
		    }		
		    
		    this.set(day, chapter);		
	    }
	};
	
	// Paramètres du player Youtube
	$scope.youtube = {
	    player: undefined,
	    
	    params: {
	        normal: {
		        /*autoplay: 1,*/
		        modestbranding: 1,
		        enablejsapi: 1,
		        rel: 0
	        },
	        full: {
		        autoplay: 1,
		        modestbranding: 1,
		        enablejsapi: 1,
		        rel: 0,
		        controls: 0
	        }
	    }
	};
	
	/*#####################################
	## Convertit un timestamp UNIX en objet date utilisable
	#######################################*/
	
	$scope.timeConverter = function(UNIX_timestamp){
		var a = new Date(UNIX_timestamp*1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		return {
			year: a.getFullYear(),
			month: months[a.getMonth() - 1],
			date: a.getDate(),
			hour: ('0' + a.getHours()).slice(-2),
			min: ('0' + a.getMinutes()).slice(-2),
			sec: ('0' + a.getSeconds()).slice(-2),
			getDate: function() {
				return this.date + ' ' + this.month + ' ' + this.year;
			},
			getTime: function() {
				return this.hour + ":" + this.min;
			}
		};
	};
	
	/*#####################################
	## Chargement des données
	#######################################*/
	
	$scope.load = function() {
	    $http({
		    method: "GET",
		    url: "stories/" + $scope.params.story + ".json"
	    }).success(function(data) {
		    $scope.story = data;
		    $scope.params.loaded = true;
	    });
	};
	
//	$scope.prevVideo = function() {
//	    var searching = true;
//	    var i = $scope.currentDay;
//	    var j = $scope.currentChapter;
//	
//	    while(searching) {
//	        if (j == 0) {                       // Si c'est le premier chapitre d'un jour
//	            if (i == 0) {                   // si c'est le premier jour
//	                searching = false;             // c'est mort on se barre
//	            } else {
//                    i--;                        // sinon on va au jour précédent, chapitre n
//	                j = $scope.days[i].chapters.length - 1;
//	            }	          
//	        } else {
//	            j--; // sinon on décrémente juste le chapitre
//	        }
//	        
//	        if ($scope.days[i].chapters[j].type == 2) {
//	            $scope.currentDay = i;
//	            $scope.currentChapter = j;
//	            searching = false;
//	            $scope.go();
//	        }
//	    }
//	};
	
//	$scope.nextVideo = function() {
//	    var searching = true;
//	    var i = $scope.currentDay;
//	    var j = $scope.currentChapter;
//	
//	    while(searching) {
//	        if (j == $scope.days[i].chapters.length - 1) { // Si c'est le dernier chapitre d'un jour
//	            if (i == $scope.days.length - 1) { // si c'est le dernier jour
//	                searching = false;             // c'est mort on se barre
//	            } else {
//	                i++;                            // sinon on va au jour suivant, chapitre 0
//	                j = 0;
//	            }	          
//	        } else {
//	            j++; // sinon on incrémente juste le chapitre
//	        }
//	        
//	        if ($scope.days[i].chapters[j].type == 2) {
//	            $scope.currentDay = i;
//	            $scope.currentChapter = j;
//	            searching = false;
//	            $scope.go();
//	        }
//	    }
//	};
	
	/*#####################################
	## Helpers pour le modèle
	#######################################*/
	
	$scope.setFullScreen = function() {
	    $scope.params.fullScreen = !$scope.params.fullScreen;
		
		if($scope.params.cinema.requestFullScreen) {
			if ($scope.params.fullScreen) {
				$scope.cinema.requestFullScreen;
			} else {
				document.cancelFullScreen;
			}
        } else if($scope.params.cinema.webkitRequestFullScreen) {
			if ($scope.params.fullScreen) {
				$scope.params.cinema.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else {
                document.webkitCancelFullScreen();
			}
        } else if($scope.params.cinema.mozRequestFullScreen){
			if ($scope.params.fullScreen) {
				$scope.params.cinema.mozRequestFullScreen();
			} else {
                document.mozCancelFullScreen();
			}
        }
	};
	
	/*#####################################
	## Gestion du scroll
	#######################################*/
	
	$scope.startScroll = function(direction) {
	
	};
	
	$scope.stopScroll = function() {
	
	};

    window.onmousewheel = function(event) {
	    if (event.deltaY > 0) {
		    $scope.startScroll("next");
	    } else {
		    $scope.startScroll("prev");
	    }
    };
	
	/*#####################################
	## Gestion des raccourcis clavier
	#######################################*/
    
    window.onkeyup = function(event) {
        switch(event.which) {
            case 38: // UP
            case 37: // LEFT
                if (event.ctrlKey) {
                    $scope.prevVideo();
                } else {
                    if (event.shiftKey) {
                        $scope.setCurrent(0, 0);
                    } else {
                        $scope.prev();
                    }
                }
                break;
            case 39: // RIGHT
            case 40: // DOWN
                if (event.ctrlKey) {
                    $scope.nextVideo();
                } else {
                    if (event.shiftKey) {
                        var day = $scope.days.length - 1;
                        var chapter = $scope.days[day].chapters.length - 1
                        $scope.setCurrent(day, chapter);
                    } else {
                        $scope.next();
                    }
                }
                break;
                
            case 32 : //SPACE
                $scope.stopPlay();
                break;
        }
        
        $scope.$apply()
    };
	
	/*#####################################
	## Events binding
	#######################################*/
	
    $scope.$on('youtube.player.ended', function ($event, player) {
        if ($scope.params.autoPlay) {
	        $scope.current.next();
        }
    });
	
	/*#####################################
	## SHOOT
	#######################################*/
	
	$scope.load();
}]).directive("dayCard", function() {
	return {
		restrict: "E",
		templateUrl: "day-card.html",
		controller: function($scope) {
			$scope.isCurrent = function(parent, idx) {
				return $scope.current.is(parent, idx);
			};
		}
	};
}).directive("twitterCard", function() {
	return {
		restrict: "E",
		templateUrl: "twitter-card.html"
	};
}).animation(".chapter", function() {
	return {
		addClass: function(element, classname) {
			var litterature = document.getElementById("litterature");
			var middle = litterature.offsetHeight / 2;
			var litterature = angular.element(litterature);
			
			litterature.scrollToElementAnimated(element, middle);
			
			//$scope.current.go();
		}
	};
})
;
	
	
})();
