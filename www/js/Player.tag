<player>
  <header if={ !params.fullScreen }>
    { opts.title }
    <div id="seasons">
      Season <span each={ season, i in seasons }>- { i + 1} </span>
    </div>
  </header>
  <div id="litterature" if={ !params.fullScreen }>
    <card each={ day, j in seasons[current.season].days } day={ day } j={ j }/>
    <div style='clear: both'></div>
  </div>
  <div id="cinema" class={ fullscreen: params.fullScreen }>
    <twitter if={ current.line.isTwitter() }/>
    <youtube if={ current.line.isYoutube() }/>
  </div>
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
  this.ytPlayer = undefined;

  this.current = {
      season: 0,
      line: undefined
  };

  setCurrent(line) {
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
  }
</player>
