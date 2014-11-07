(function () { 
angular.module("player", ['youtube-embed', "ngAnimate", "duScroll"])
.controller("PlayerController", 
[ "$window", "$scope", "$http", "$timeout", "$log", "$animate", 
function($window, $scope, $http, $timeout, $log, $animate) {
	$scope.story = "marble-hornets";
	$scope.accounts = [];
	$scope.title = "";
	$scope.chapters = [];
	$scope.days = [];
	$scope.currentDay = 0;
	$scope.currentChapter = 0;
	$scope.tick = 2000;
	$scope.autoplay = false;
	$scope.currentVideo = "";
	$scope.handle = undefined;
	$scope.scrolling = 0;
	$scope.player = undefined;
	$scope.fullScreen = false;
	$scope.cinema = document.getElementById("player");
	
	$scope.playerVars = {
		/*autoplay: 1,*/
		modestbranding: 1,
		enablejsapi: 1,
		rel: 0
	};
	
	$scope.fullScreenVars = {
		autoplay: 1,
		modestbranding: 1,
		enablejsapi: 1,
		rel: 0,
		controls: 0
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
		    url: "stories/" + $scope.story + ".json"
	    }).success(function(data) {
		    $scope.accounts = data.accounts;
		    $scope.title = data.title;
		    $scope.chapters = data.chapters;
		
		    var lastDate = "";
		    var currentDay = {
			    date: "",
			    chapters: []
		    };
		
		    for(var i = 0;i <= $scope.chapters.length - 1;i++) {
			    var chapter = $scope.chapters[i];
			
			    var time = $scope.timeConverter(chapter.time);
			
			    if (time.getDate() != lastDate) {
				    if (lastDate != "") { $scope.days.push(currentDay); }
				
				    chapter.time = time;
				
				    currentDay = {
					    date: time.getDate(),
					    chapters: [chapter]
				    };
			    } else {
				    chapter.time = time;
				    currentDay.chapters.push(chapter);
			    }
			    lastDate = time.getDate();
		    }

		    $scope.go();	
	    });
	};	
	
	/*#####################################
	## Navigation
	#######################################*/
	
	$scope.prevVideo = function() {
	    var searching = true;
	    var i = $scope.currentDay;
	    var j = $scope.currentChapter;
	
	    while(searching) {
	        if (j == 0) {                       // Si c'est le premier chapitre d'un jour
	            if (i == 0) {                   // si c'est le premier jour
	                searching = false;             // c'est mort on se barre
	            } else {
                    i--;                        // sinon on va au jour précédent, chapitre n
	                j = $scope.days[i].chapters.length - 1;
	            }	          
	        } else {
	            j--; // sinon on décrémente juste le chapitre
	        }
	        
	        if ($scope.days[i].chapters[j].type == 2) {
	            $scope.currentDay = i;
	            $scope.currentChapter = j;
	            searching = false;
	            $scope.go();
	        }
	    }
	};
	
	$scope.prev = function() {
		if ($scope.currentChapter > 0) {
			$scope.currentChapter--;	
		} else {
			if ($scope.currentDay > 0) {
				$scope.currentDay--;
				$scope.currentChapter = $scope.days[$scope.currentDay].chapters.length - 1;	
			}		
		}				
		$scope.go();
	};
	
	$scope.stopPlay = function() {
		$scope.autoplay = !$scope.autoplay;
		if ($scope.autoplay && $scope.getCurrent().type != 2) {
		    $scope.next();
		}
	};
	
	$scope.next = function() {
		if ($scope.currentChapter < $scope.days[$scope.currentDay].chapters.length - 1) {
			$scope.currentChapter++;	
		} else {
			if ($scope.currentDay < $scope.days.length - 1) {
				$scope.currentDay++;
				$scope.currentChapter = 0;	
			}		
		}				
		$scope.go();
	};
	
	$scope.nextVideo = function() {
	    var searching = true;
	    var i = $scope.currentDay;
	    var j = $scope.currentChapter;
	
	    while(searching) {
	        if (j == $scope.days[i].chapters.length - 1) { // Si c'est le dernier chapitre d'un jour
	            if (i == $scope.days.length - 1) { // si c'est le dernier jour
	                searching = false;             // c'est mort on se barre
	            } else {
	                i++;                            // sinon on va au jour suivant, chapitre 0
	                j = 0;
	            }	          
	        } else {
	            j++; // sinon on incrémente juste le chapitre
	        }
	        
	        if ($scope.days[i].chapters[j].type == 2) {
	            $scope.currentDay = i;
	            $scope.currentChapter = j;
	            searching = false;
	            $scope.go();
	        }
	    }
	};
	
	/*#####################################
	## Affichage du chapitre en cours
	#######################################*/
	
	$scope.go = function() {			
		var currentChapter = $scope.days[$scope.currentDay].chapters[$scope.currentChapter];
		
		if (currentChapter.category == "media") {
			$scope.currentVideo = currentChapter.id;				
		} else {
			$scope.currentVideo = "";
			if ($scope.player !== undefined) {
			    $scope.player.stopVideo()
			}
			if ($scope.autoplay) {
			    $scope.handle = $timeout(function() {
			        if ($scope.autoplay) {
				        $scope.next();
			        }
			    }, $scope.tick);
			}
		}
	};
	
	/*#####################################
	## Helpers pour le modèle
	#######################################*/
	
	$scope.isDisplayed = function(idx) {
		return (Math.max(idx, $scope.currentDay) - Math.min(idx, $scope.currentDay) <= 3);
	};
	
	$scope.isTwitter = function() {
		return ($scope.getCurrent().type == 1);
	};
	
	$scope.isYoutube = function() {
		return ($scope.getCurrent().type == 2);
	};
	
	$scope.getCurrent = function() {
		return (($scope.days[$scope.currentDay] || { chapters: [] }).chapters[$scope.currentChapter] || { });
	};
	
	$scope.setCurrent = function(parent, idx) {
	    $scope.currentDay = parent;
	    $scope.currentChapter = idx;
	    $scope.go();
	};
	
	$scope.setFullScreen = function() {
	    $scope.fullScreen = !$scope.fullScreen;
		
		if($scope.cinema.requestFullScreen) {
			if ($scope.fullScreen) {
				$scope.cinema.requestFullScreen;
			} else {
				document.cancelFullScreen;
			}
        } else if($scope.cinema.webkitRequestFullScreen) {
			if ($scope.fullScreen) {
				$scope.cinema.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else {
                document.webkitCancelFullScreen();
			}
        } else if($scope.cinema.mozRequestFullScreen){
			if ($scope.fullScreen) {
				$scope.cinema.mozRequestFullScreen();
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
        if ($scope.autoplay) {
	        $scope.next();
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
				return ($scope.currentDay == parent && $scope.currentChapter == idx);
			};
		}
	};
}).directive("twitterCard", function() {
	return {
		restrict: "E",
		templateUrl: "twitter-card.html",
		controller: function($scope) {
		}
	};
}).animation(".chapter", function() {
	return {
		addClass: function(element, classname) {
			var litterature = document.getElementById("litterature");
			var middle = litterature.offsetHeight / 2;
			var litterature = angular.element(litterature);
			
			litterature.scrollToElementAnimated(element, middle);
		}
	};
})
;
	
	
})();
