riot.tag('player', '<header if="{ !params.fullScreen }"> { opts.title } <div id="seasons"> Season <span each="{ seasons }">- {{$index + 1}} </span> </div> </header> <div id="litterature" ng-if="!params.fullScreen"> <day-card ng-repeat="day in story.seasons[current.season].days"></day-card> <div style=\'clear: both\'></div> </div> <div id="cinema" ng-class="{ fullscreen: params.fullScreen }"> <twitter-card ng-if="current.isTwitter()"></twitter-card> <div ng-if="!params.fullScreen" ng-show="current.isYoutube()"> <youtube-video id="video-player" video-id="youtube.video" player="youtube.player" player-vars="youtube.params.normal"></youtube-video> <div id="description">{{youtube.description}} - (<span class="author">{{youtube.author}}</span>)</div> </div> <div ng-if="params.fullScreen" ng-show="current.isYoutube()" class="big-screen"> <youtube-video id="fullscreen-player" video-id="youtube.video" player="youtube.player" player-vars="youtube.params.full" player-width="\'100%\'" player-height="\'100%\'"></youtube-video> </div> </div> <footer ng-class="{ fullscreen: params.fullScreen }"> <div id="controls"> <img src="img/prev-grunge.png" width="100" height="100" ng-click="current.prev()" title="Previous"></img> <img src="img/operator-false.png" width="100" height="100" ng-click="params.stopPlay()" class="operator" title="Toggle autoplay" ng-class="{ autoplay: params.autoPlay }"></img> <img src="img/next-grunge.png" width="100" height="100" ng-click="current.next()" title="Next"></img> <img src="img/fullscreen.png" width="100" height="100" ng-click="params.setFullScreen()" title="Full screen"></img> </div> <div id="jauge" ng-click="current.seekTo()"> <div ng-style="{ width: current.getProgress() }"></div> </div> </footer>', function(opts) {
})
