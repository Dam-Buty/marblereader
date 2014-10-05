(function() {	
	angular.module("player", [])
	.controller("PlayerController", [ "$scope", "$http", function($scope, $http) {	
		$scope.story = 1;
		$scope.accounts = [];
		$scope.title = "";
		$scope.chapters = [];
		$scope.min = 0;
		$scope.max = 0;
		$scope.interval = 0;
		$scope.minReadable = "";
		$scope.maxReadable = "";
		$scope.current = 0;
		$scope.timer = undefined;
		
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
		
		$scope.type = function(chapter) {
			if (chapter.type == 1) {
				return "twitter";
			} else {
				return "youtube";
			}
		};
		
		$scope.next = function() {
			if ($scope.current == $scope.chapters.length - 1) {
				clearInterval($scope.timer);
			} else {
				$scope.current++;
			}
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
		});
		
		$scope.timer = setInterval(function() {
			$scope.next();
		}, 2000);
	}]);
	
})();