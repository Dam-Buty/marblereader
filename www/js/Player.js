riot.tag('player', '<header if="{ !params.fullScreen }"> { opts.title } <div id="seasons"> Season <span each="{ season, i in seasons }">- { i + 1} </span> </div> </header> <div id="litterature" if="{ !params.fullScreen }"> <card each="{ day, j in seasons[current.season].days }" day="{ day }" j="{ j }"></card> <div style=\'clear: both\'></div> </div> <div id="cinema" class="{ fullscreen: params.fullScreen }"> <twitter if="{ current.line.isTwitter() }"></twitter> <youtube if="{ current.line.isYoutube() }"></youtube> </div>', function(opts) {
  this.params = opts.params;
  this.seasons = opts.seasons;
  this.ytPlayer = undefined;

  this.current = {
      season: 0,
      line: undefined
  };

  this.setCurrent = function(line) {
    if (this.current.line !== undefined) {
      this.current.line.unsetCurrent();
    }

    this.current.line = line;

    if (this.current.line.chapter.type == "youtube") {
      this.ytPlayer.playVideoAt(this.current.line.chapter.playlistId);
    } else {
      this.ytPlayer.pauseVideo();
    }

    this.update();
  }.bind(this)
})
