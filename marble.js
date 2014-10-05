function timeConverter(UNIX_timestamp){
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
}

(function() {
	
		// this.twitter = $("<i></i>").addClass("fa").addClass("fa-twitter");
		// this.youtube = $("<i></i>").addClass("fa").addClass("fa-youtube");
	
	angular.module("player", [ ])
	.controller("PlayerController", function(){
		var self = this;
		this.title = "";
		this.chapters = [];
		this.timeline = $("#timeline");
		this.min = 0;
		this.max = 0;
		this.interval = 0;
		this.minReadable = "";
		this.maxReadable = "";
		this.text = "mlk";
		
		$.ajax({
			type: "GET",
			url: "json/story.php",
			data: {
				story: 1
			},
			statusCode: {
				200: function(data) {
					self.story = data;
					self.interval = data.max - data.min;
					self.minReadable = timeConverter(data.min);
					self.maxReadable = timeConverter(data.max);
				}
			}
		});	
	});
	
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