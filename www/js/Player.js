riot.tag('player', '<header if="{ !params.fullScreen }"> { opts.title } <div id="seasons"> Season <span each="{ season, i in seasons }">- { i + 1} </span> </div> </header> <div id="litterature" if="{ !params.fullScreen }"> <card each="{ day, j in seasons[current.season].days }" day="{ day }" j={ j }></div> <div style=\'clear: both\'></div> </div> <div id="cinema" class="{ fullscreen: params.fullScreen }"> <twitter if={ current.line.isTwitter() }></div> <youtube if={ current.line.isYoutube() }></youtube> </div> <footer class="{ fullscreen: params.fullScreen }"> <div id="controls"> <img src="img/prev-grunge.png" width="100" height="100" onclick="{ previous }" title="Previous"/> <img src="img/operator-false.png" width="100" height="100" class="operator" title="Toggle autoplay"/> <img src="img/next-grunge.png" width="100" height="100" onclick="{ next }" title="Next"/> <img src="img/fullscreen.png" width="100" height="100" title="Full screen"/> </div> <div id="jauge" ng-click="current.seekTo()"> <div ng-style="{ width: current.getProgress() }"></div> </div> </footer>', function(opts) {

  this.params = opts.params;
  this.seasons = opts.seasons;
  this.ytPlayer = undefined;

  this.current = {
      season: 0,
      line: undefined
  };

  this.setCurrent = function(line, j, k) {
    if (this.current.line !== undefined) {
      this.current.line.unsetCurrent();
    }

    this.current.line = line;

    if (this.current.line.chapter.type == "youtube") {
      if (this.params.autoPlay) {
        this.ytPlayer.playVideoById(this.current.line.chapter.id);
      } else {
        this.ytPlayer.cueVideoById(this.current.line.chapter.id);
      }
    }

    this.update();
  }.bind(this);

  this.previous = function(e) {
    var i = this.current.season;
    var j = this.current.line.j;
    var k = this.current.line.k;

    var season = this.seasons[i];
    var day = season.days[j];

    k++;

    if (k >= day.chapters.length) {
      k = 0;
    }








    console.log(this.current.line);
  }.bind(this);

});
