(function() {	

angular.module("player", ['youtube-embed', "ngAnimate", "duScroll"])
.controller("PlayerController", 
[ "$scope", "$http", "$timeout", "$log", "$animate", 
function($scope, $http, $timeout, $log, $animate) {
	$scope.story = 1;
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
	
	$scope.playerVars = {
		autoplay: 1
	};
	
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
	
	$scope.go = function() {			
		var currentChapter = $scope.days[$scope.currentDay].chapters[$scope.currentChapter];
		
		if (currentChapter.category == "media") {
			$scope.currentVideo = currentChapter.id;				
		} else {
			$scope.currentVideo = "";
			if ($scope.autoplay) {
			    $scope.handle = $timeout(function() {
			        if ($scope.autoplay) {
				        $scope.next();
			        }
			    }, $scope.tick);
			}
		}
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
	
	$scope.startScroll = function(direction) {
	
	};
	
	$scope.stopScroll = function() {
	
	};
	
	$scope.load = function() {
	    $http({
		    method: "GET",
		    url: "json/" + $scope.story + ".json"
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
		
    $scope.$on('youtube.player.ended', function ($event, player) {
        if ($scope.autoplay) {
	        $scope.next();
        }
    });

    window.onmousewheel = function(event) {
	    if (event.deltaY > 0) {
		    $scope.startScroll("next");
	    } else {
		    $scope.startScroll("prev");
	    }
    };
	
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
}).directive("youtubeCard", function() {
	return {
		restrict: "E",
		templateUrl: "youtube-card.html",
		controller: function($scope) {
		}
	};
})/*.directive("scrollTo", function() {
	return {
		restrict: "A",
		link: function(scope, element, attr) {
			var litterature = document.getElementById("litterature");
			var middle = litterature.offsetHeight / 2;
			
			element.addClass("current");
			angular.element(litterature).scrollToElementAnimated(element, middle);
		}
	};
})*/.animation(".chapter", function() {
	return {
		addClass: function(element, classname) {
			var litterature = angular.element(document.getElementById("litterature"));
			var middle = litterature[0].offsetHeight / 2;
			
			litterature.scrollToElementAnimated(element, middle);
		}
	};
})
;
	
	
})();
