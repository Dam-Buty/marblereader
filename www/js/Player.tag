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
      chapter: undefined
  };

  setCurrent(line) {
    if (this.current.chapter !== undefined) {
      this.current.chapter.unsetCurrent();
    }

    this.current.chapter = line;
  }
</player>
