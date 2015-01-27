riot.tag('youtube', '<div id="youtube-player"></div>', function(opts) {

  var self = this;
  this.player = undefined;

  window.onYouTubeIframeAPIReady = function(e) {
    self.player = new YT.Player('youtube-player', {
      height: '390',
      width: '640',
      events: {
        'onReady': function(e) {
          self.parent.ytPlayer = e.target;
        },
        'onStateChange': function(e) {
          console.log(e);
        }
      }
    });
  }


});
