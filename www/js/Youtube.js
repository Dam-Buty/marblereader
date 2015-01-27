riot.tag('youtube', '<div id="youtube-player"></div>', function(opts) {
  var self = this;
  this.player = undefined;

  window.onYouTubeIframeAPIReady = function(e) {
    self.player = new YT.Player('youtube-player', {
      height: '390',
      width: '640',
      events: {
        'onReady': function(e) {
          var player = ;
          var videos = [];
          var seasons = self.parent.seasons;

          for(var i = 0;i < seasons.length;i++) {
            var season = seasons[i];
            for(var j = 0;j < season.days.length;j++) {
              var day = season.days[j];
              for(var k = 0;k < day.chapters.length;k++) {
                var chapter = day.chapters[k];
                if (chapter.type == "youtube") {
                  chapter.playlistId = videos.length;
                  videos.push(chapter.id);
                }
              }
            }
          }

          player.cuePlaylist(videos);
          self.parent.ytPlayer = e.target;
        },
        'onStateChange': function(e) {
          console.log(e);
        }
      }
    });
  }


})
