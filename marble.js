(function() {	
	angular.module("player", ['angular-carousel'])
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
		
		
	}]);
	
})();


			
			// 
			// $.each(data.chapters, function(i, chapter) {
				// var offset = (chapter.time - min) / interval;
				// var x = offset * timeline.innerWidth();
				// var y = Math.random() * timeline.innerHeight();
				// var icon = undefined;
				
				// switch(chapter.type) {
					// case "1":
						// icon = twitter.clone();
						// break;
					// case "2":
						// icon = youtube.clone();
						// break;
				// }
				
				// timeline.append(icon.css({
					// left: x + "px",
					// top: y + "px"
				// }));
			// });