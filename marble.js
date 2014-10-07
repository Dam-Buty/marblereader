(function() {	
	angular.module("player", ['youtube-embed'])
	.controller("PlayerController", [ "$scope", "$http", "$interval", function($scope, $http, $interval) {	
		$scope.story = 1;
		$scope.accounts = [];
		$scope.title = "";
		$scope.chapters = [];
		$scope.displayedChapters = [];
		$scope.min = 0;
		$scope.max = 0;
		$scope.interval = 0;
		$scope.minReadable = "";
		$scope.maxReadable = "";
		$scope.current = -1;
		$scope.timer = undefined;
		$scope.currentVideo = "";
		$scope.litterature = angular.element(document.getElementById("litterature"));
		
		$scope.playerVars = {
			autoplay: 1
		};
		
		$scope.timeConverter = function(UNIX_timestamp){
			var a = new Date(UNIX_timestamp*1000);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth() - 1];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
			return time;
		};
		
		$scope.next = function() {
			$scope.current++;
			
			var currentChapter = $scope.chapters[$scope.current];
			
			$scope.displayedChapters.push(currentChapter);
			
			if (currentChapter.type == 2) {
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
				}, 2000);
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
			$scope.interval = data.max - data.min;
			$scope.minReadable = $scope.timeConverter(data.min);
			$scope.maxReadable = $scope.timeConverter(data.max);
			
			$scope.go();
		});
		
		
	}]).directive("chapterCard", function() {
		var link = function(scope, element, attrs) {
			console.log(litterature);
			litterature.css({
				top: (-1 * (element.css("height") / 2))
			});
		};
		
		return {
			templateUrl: "chapter-card.html",
			link: link,
			controller: function(scope, element, attrs) {
				console.log(litterature);
				litterature.css({
					top: (-1 * (element.css("height") / 2))
				});
			}
		};
	});;
	
})();