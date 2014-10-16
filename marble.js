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
	$scope.currentVideo = "";
	$scope.handle = undefined;
	
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
	
	$scope.previous = function() {
		if ($scope.currentChapter > 0) {
			$scope.currentChapter--;	
		} else {
			if ($scope.currentDay > 0) {
				$scope.currentDay--;
				$scope.currentChapter = 0;	
			}		
		}				
		$scope.go();
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
	
	$scope.go = function() {			
		var currentChapter = $scope.days[$scope.currentDay].chapters[$scope.currentChapter];
		
		if (currentChapter.category == "media") {
			$scope.currentVideo = currentChapter.id;				
		} else {
			$scope.currentVideo = "";
			$scope.handle = $timeout(function() {
				$scope.next();
			}, $scope.tick);
		}
	};
	
	$scope.isTwitter = function() {
		return ($scope.getCurrent().type == 1);
	};
	
	$scope.isYoutube = function() {
		return ($scope.getCurrent().type == 2);
	};
	
	$scope.getCurrent = function() {
		return $scope.days[$scope.currentDay].chapters[$scope.currentChapter];
	};
	
	$scope.stop = function() {
		$timeout.cancel($scope.handle);
	};
	
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
		
		$scope.$on('youtube.player.ended', function ($event, player) {
			$scope.next();
		});
		
		window.onmousewheel = function(event) {
			if (event.deltaY == 100) {
				$scope.next(true);
			} else {
				$scope.previous(true);
			}
		};

		$scope.go();	
	});
	
	
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
