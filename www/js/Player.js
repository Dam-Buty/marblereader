riot.tag('player', '<header if="{ !params.fullScreen }"> { opts.title } <div id="seasons"> Season <span each="{ season, i in seasons }">- { i + 1} </span> </div> </header> <div id="litterature" if="{ !params.fullScreen }"> <div each="{ day in seasons[current.season].days }"> <div class="{day: true, delay: true}" if="{ day.delay != "" }"> { day.delay } </div> <div class="day"> <h3>{ day.date }</h3> <div class="{ chapter: true }" each="{ chapter in day.chapters }"> <span class="time"><u>{ chapter.time }</u> : </span> <span if="{ chapter.type == \'youtube\' }"> <i class="fa fa-youtube-square marron"></i> &nbsp;{ chapter.title } </span> <span if="{ chapter.type==\'twitter\' }"> <i class="fa fa-twitter-square marron"></i> &nbsp;{ chapter.content } </span> <span if="{ chapter.type==\'youtube\' }" class="author">&nbsp;--&nbsp;{ chapter.account }</span> </div> </div> </div> <div style=\'clear: both\'></div> </div>', function(opts) {
  this.params = opts.params;
  this.seasons = opts.seasons;

  this.current = {
    season: 0,
    day: 0,
    chapter: 0/*,

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
    is: function(day, chapter) {
      return (this.day == day && this.chapter == chapter);
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
  };
})