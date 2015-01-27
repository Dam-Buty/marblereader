riot.tag('player', '<header if="{ !params.fullScreen }"> { opts.title } <div id="seasons"> Season <span each="{ season, i in seasons }">- { i + 1} </span> </div> </header> <div id="litterature" if="{ !params.fullScreen }"> <card each="{ day, j in seasons[current.season].days }" day="{ day }" j="{ j }"></card> <div style=\'clear: both\'></div> </div>', function(opts) {
  this.params = opts.params;
  this.seasons = opts.seasons;

  this.current = {
      season: 0,
      chapter: undefined
  };

  this.setCurrent = function(line) {
    if (this.current.chapter !== undefined) {
      this.current.chapter.unsetCurrent();
    }

    this.current.chapter = line;
  }.bind(this)
})
