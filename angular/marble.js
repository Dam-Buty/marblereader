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
	    },
	    
	    setFullScreen: function() {
	        this.fullScreen = !this.fullScreen;
	        localStorage.setItem("fullScreen", this.fullScreen);
	        this._setFullScreen();
	    },
	    _setFullScreen: function() {
	        if(this.cinema.requestFullScreen) {
			    if (this.fullScreen) {
				    $scope.cinema.requestFullScreen;
			    } else {
				    document.cancelFullScreen;
			    }
            } else if(this.cinema.webkitRequestFullScreen) {
			    if (this.fullScreen) {
				    this.cinema.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			    } else {
                    document.webkitCancelFullScreen();
			    }
            } else if(this.cinema.mozRequestFullScreen){
			    if (this.fullScreen) {
				    this.cinema.mozRequestFullScreen();
			    } else {
                    document.mozCancelFullScreen();
			    }
            }
        }
    };
    
	// Données de l'histoire
    $scope.story = {
        title: "",
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
	            var day = $scope.story.seasons[this.season].days[this.day];
	            var chapter = day.chapters[this.chapter];
	            
	            chapter["date"] = day.date;
	            
	            return chapter;
	        } else {
	            return { };
	        }
	    },
	    set: function(season, day, chapter) {
	        this.season = season;
	        this.day = day;
	        this.chapter = chapter;
	        
	        localStorage.setItem("progress", {
	            season: season,
	            day: day,
	            chapter: chapter
	        });
	        
	        var currentChapter = this.get();
		
	        if (currentChapter.type != "youtube" && $scope.params.autoPlay) {
                $scope.params.handle = $timeout(function() {
                    if ($scope.params.autoPlay) {
	                    $scope.current.next();
                    }
                }, $scope.params.tick);
	        }
	    },
	    goVideo: function() {
            if (this.get().type == "youtube") {
                $scope.youtube.video = this.get().id;
            } else {
	            if ($scope.youtube.player !== undefined) {
			        $scope.youtube.player.stopVideo();
			    }
            }
	    },
	    is: function(day, chapter) {
	        return (this.day == day && this.chapter == chapter);
	    },
	    displayed: function() {
	        var first = Math.max(this.day - 3, 0);
	        var displayed = [];
	        
	        for(var i = first;i < first + 3;i++) {
	            displayed.push($scope.story.seasons[this.season].days[i]);
	        }
	        
	        return displayed;
	    },	    
	    isTwitter: function() {
	        return (this.get().type == "twitter");
	    },	    
	    isYoutube: function() {
	        return (this.get().type == "youtube");
	    },
	    getProgress: function() {
	        var total = $scope.story.seasons[this.season].duration;
	        var progress = this.get().seasonProgress;
	        
	        var percentage = (progress / total) * 100;
	        return percentage + "%";
	    },
	    
	    // Navigation
	    prev: function() {
	        var season = this.season;
	        var day = this.day;
	        var chapter = this.chapter;
	        	        
		    if (chapter > 0) {
			    chapter--;	
		    } else {
			    if (day > 0) {
				    day--;
				    chapter = $scope.story.seasons[this.season].days[day].chapters.length - 1;
			    }		
		    }
		    
		    this.set(season, day, chapter);	
	    },
	    next: function() {
	        var season = this.season;
	        var day = this.day;
	        var chapter = this.chapter;
	        
		    if (chapter < $scope.story.seasons[this.season].days[day].chapters.length - 1) {
			    chapter++;	
		    } else {
			    if (day <$scope.story.seasons[this.season].days.length - 1) {
				    day++;
				    chapter = 0;	
			    }		
		    }		
		    
		    this.set(season, day, chapter);		
	    }
	};
	
	// Paramètres du player Youtube
	$scope.youtube = {
	    player: undefined,
	    video: undefined,
	    
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
		    
		    // Récupération des params stockés
		    // Les bugs sont LA
		    if (localStorage.getItem("fullScreen") !== null) {
		        $scope.params.fullScreen = localStorage.getItem("fullScreen");
		        if ($scope.params.fullScreen) {
		            $scope.params._setFullScreen();
		        }
		    }
		    
		    if (localStorage.getItem("progress") !== null) {
		        $scope.current.season = localStorage.getItem("progress").season;
		        $scope.current.day = localStorage.getItem("progress").day;
		        $scope.current.chapter = localStorage.getItem("progress").chapter;
		    }
		        
		    if ($scope.current.get().type == "youtube") {
		        $scope.current.goVideo();
		    }
	    });
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
    var getScope = function(e) {
        return angular.element(e).scope();
    }; 
    
	return {
		addClass: function(element, classname) {
			var litterature = document.getElementById("litterature");
			var middle = litterature.offsetHeight / 2;
			var litterature = angular.element(litterature);
			
			litterature.scrollToElementAnimated(element, middle).then(function() {
			    getScope(element).current.goVideo();
			});
			
			//$scope.current.go();
		}
	};
})
;
	
	
})();
