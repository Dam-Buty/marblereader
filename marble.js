(function() {	
	angular.module("player", ['youtube-embed'])
	.controller("PlayerController", [ "$scope", "$http", "$timeout", function($scope, $http, $timeout) {	
		$scope.story = 1;
		$scope.accounts = [];
		$scope.title = "";
		$scope.chapters = [];
		$scope.days = [];
		$scope.currentDay = 0;
		$scope.currentChapter = 0;
		$scope.tick = 4000;
		$scope.currentVideo = "";
		$scope.litterature = angular.element(document.getElementById("litterature"));
		
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
		
		$scope.next = function() {
			if ($scope.currentDay < $scope.days.length - 1) {
				if ($scope.currentChapter < $scope.days[$scope.currentDay].chapters.length - 1) {
					$scope.currentChapter++;	
				} else {
					$scope.currentDay++;
					$scope.currentChapter = 0;	
				}				
			}		
			$scope.go();
		};
		
		$scope.go = function() {			
			var currentChapter = $scope.days[$scope.currentDay].chapters[$scope.currentChapter];
			
			if (currentChapter.type == "media") {
				$scope.currentVideo = currentChapter.id;				
			} else {
				$timeout(function() {
					$scope.next();
				}, $scope.tick);
			}
		};
		
		$http({
			method: "GET",
			url: "json/story.php",
			params: { story: $scope.story }
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

			$scope.go();	
		});
		
		
	}]).directive("dayCard", ['$animate', function($animate) {
		return {
		    restrict: "E",
			templateUrl: "day-card.html",
			controller: function($scope) {
			    $scope.isCurrent = function(parent, idx) {
					if ($scope.currentDay == parent && $scope.currentChapter == idx) {
						return true;
					} else {
						return false;
					}
				};
			}
		};
	}]).animation(".chapter", function() {
		return {
			addClass: function(element, classname, done) {
				console.log(element);
				console.log(classname);
				console.log(done);
			}
		};
	});
	
})();
