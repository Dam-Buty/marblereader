<player>
  <header if={ !params.fullScreen }>
    { opts.title }
    <div id="seasons">
      Season <span each={ season, i in seasons }>- { i + 1} </span>
    </div>
  </header>
  <div id="litterature" if={ !params.fullScreen }>
    <card each={ day, j in seasons[current.season].days } day={ day } idx={ j }/>
    <div style='clear: both'></div>
  </div>
  // <div id="cinema" ng-class="{ fullscreen: params.fullScreen }">
  //   <twitter-card ng-if="current.isTwitter()"></twitter-card>
  //   <div ng-if="!params.fullScreen" ng-show="current.isYoutube()">
  //     <youtube-video id="video-player" video-id="youtube.video" player="youtube.player" player-vars="youtube.params.normal"></youtube-video>
  //     <div id="description">{{youtube.description}} - (<span class="author">{{youtube.author}}</span>)</div>
  //   </div>
  //   <div ng-if="params.fullScreen" ng-show="current.isYoutube()" class="big-screen">
  //     <youtube-video id="fullscreen-player" video-id="youtube.video" player="youtube.player" player-vars="youtube.params.full" player-width="'100%'" player-height="'100%'"></youtube-video>
  //   </div>
  // </div>
  // <footer ng-class={ fullscreen: params.fullScreen }>
  //   <div id="controls">
  //     <!--<img src="img/prev-video.png" width="100" height="100" ng-click="prevVideo()" title="Previous video"/>-->
  //     <img src="img/prev-grunge.png" width="100" height="100" ng-click="current.prev()" title="Previous"/>
  //     <img src="img/operator-false.png" width="100" height="100" ng-click="params.stopPlay()" class="operator" title="Toggle autoplay" ng-class="{ autoplay: params.autoPlay }"/>
  //     <img src="img/next-grunge.png" width="100" height="100" ng-click="current.next()" title="Next"/>
  //     <!--<img src="img/next-video.png" width="100" height="100" ng-click="nextVideo()" title="Next video"/>-->
  //     <img src="img/fullscreen.png" width="100" height="100" ng-click="params.setFullScreen()" title="Full screen"/>
  //   </div>
  //   <div id="jauge" ng-click="current.seekTo()">
  //     <div ng-style="{ width: current.getProgress() }"></div>
  //   </div>
  // </footer>

  this.params = opts.params;
  this.seasons = opts.seasons;

  this.current = {
    season: 0,
    day: 0,
    chapter: 0,

    is: function(e) {
      console.log(e);
      return (this.day == day && this.chapter == chapter);
    }/*,

    // Helpers
    get: function() {
      if (this.season != -1) {
        var day = $scope.story.seasons[this.season].days[this.day];
        var chapter = day.chapters[this.chapter];

        chapter.date = day.date;

        return chapter;
      } else {
        return { };
      }
    },
    set: function(season, day, chapter) {
      if (season !== undefined) {
        this.season = season;
        this.day = day;
        this.chapter = chapter;
      }

      var progress = {
        season: this.season,
        day: this.day,
        chapter: this.chapter
      };

      localStorage.setItem("progress", JSON.stringify(progress));

      var currentChapter = this.get();

      if (this.isTwitter() && $scope.params.autoPlay) {
        $scope.params.handle = $timeout(function() {
          if ($scope.params.autoPlay) {
            $scope.current.next();
          }
        }, this.get().duration);
      }
    },

    goVideo: function() {
      if (this.isYoutube()) {
        $scope.youtube.video = this.get().id;
        $scope.youtube.description = this.get().content;
        $scope.youtube.author = this.get().account;
      } else {
        if ($scope.youtube.player !== undefined) {
          $scope.youtube.player.stopVideo();
        }
      }
    },
    displayed: function() {
      var first = Math.max(this.day - 3, 0);
      var displayed = [];

      for(var i = first;i < first + 3;i++) {
        displayed.push($scope.story.seasons[this.season].days[i]);
      }

      return displayed;
    },
    isTwitter: function() {
      return (this.get().type == "twitter");
    },
    isYoutube: function() {
      return (this.get().type == "youtube");
    },
    getProgress: function() {
      var total = $scope.story.seasons[this.season].duration;
      var progress = this.get().seasonProgress;

      var percentage = (progress / total) * 100;
      return percentage + "%";
    },

    // Navigation
    prev: function() {
      var season = this.season;
      var day = this.day;
      var chapter = this.chapter;

      if (chapter > 0) {
        chapter--;
      } else {
        if (day > 0) {
          day--;
          chapter = $scope.story.seasons[this.season].days[day].chapters.length - 1;
        }
      }
      this.set(season, day, chapter);
    },
    next: function() {
      var season = this.season;
      var day = this.day;
      var chapter = this.chapter;

      if (chapter < $scope.story.seasons[this.season].days[day].chapters.length - 1) {
        chapter++;
      } else {
        if (day <$scope.story.seasons[this.season].days.length - 1) {
          day++;
          chapter = 0;
        }
      }

      this.set(season, day, chapter);
    }*/
  }
</player>
