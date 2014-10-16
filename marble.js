(function() {	
	angular.module("player", ['youtube-embed'])
	.controller("PlayerController", [ "$scope", "$http", "$interval", function($scope, $http, $interval) {	
		$scope.story = 1;
		$scope.accounts = [];
		$scope.title = "";
		$scope.chapters = [];
		$scope.story = [];
		$scope.min = 0;
		$scope.max = 0;
		$scope.current = -1;
		$scope.timer = undefined;
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
				hour: a.getHours(),
				min: a.getMinutes(),
				sec: a.getSeconds(),
				getDate: function() {
					return this.date + ' ' + this.month + ' ' + this.year;
				},
				getTime: function() {
					return this.hour + ":" + this.min + "," + this.sec;
				}
			};
		};
		
		$scope.next = function() {
			$scope.current++;
			var top = $scope.litterature.css("top");
			$scope.litterature.css("top", "-=55px");
			
			var currentChapter = $scope.chapters[$scope.current];
			
			$scope.displayedChapters.push(currentChapter);
			
			if (currentChapter.type == "media") {
				$scope.stop();
				$scope.currentVideo = currentChapter.id;
				
			    $scope.$on('youtube.player.ended', function ($event, player) {
					$scope.go();
			    });
			}
		},
		
		$scope.go = function() {
			if ($scope.timer === undefined) {
				$scope.timer = $interval(function() {
					$scope.next();
				}, $scope.tick);
			}
		},
		
		$scope.stop = function() {
			$interval.cancel($scope.timer);
			$scope.timer = undefined;
		},
		
		$http({
			method: "GET",
			url: "json/story.php",
			params: { story: $scope.story }
		}).success(function(data) {
			$scope.accounts = data.accounts;
			$scope.title = data.title;
			$scope.chapters = data.chapters;
			$scope.min = data.min;
			$scope.max = data.max;
			
			var lastDate = "";
			var currentDay = {
				date: "",
				chapters: []
			};
			
			for(var i = 0;i <= $scope.chapters.length - 1;i++) {
				var chapter = $scope.chapters[i];
				
				var time = $scope.timeConverter(chapter.time);
				
				if (time.getDate() != lastDate) {
					if (lastDate != "") { scope.story.push(currentDay); }
					currentDay = {
						date: time.getDate(),
						chapters: [chapter]
					};
				} else {
					chapter.time = time;
					currentDay.chapters.push(chapter);
				}
			}
			
			$scope.go();
		});
		
		
	}]).directive("dayCard", function() {
		return {
		    restrict: "E",
			templateUrl: "day-card.html",
			controller: function($scope) {
			    // $scope.chapterClass = function(idx) {
			        // var current = $scope.current;
			        
		            // if (idx == current) {
		                // return "current";
		            // } else {
			            // if (idx < current) {
			                // if (idx == current - 1) {
			                    // return "latest";
			                // } else {
			                    // return "old";
			                // }
			            // } else {
			                // if (idx == current + 1) {
			                    // return "next";
			                // } else {
			                    // return "new";
			                // }
			            // }
		            // }
			    // };
			}
		};
	});;
	
})();
